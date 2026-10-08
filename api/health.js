/**
 * Self-contained, zero-external-import Health Monitoring API for Vercel Serverless & Express.
 * Accessible at GET /api/health
 */

const SMITHERY_JAPAN_SEASONS_MCP = "https://server.smithery.ai/haomingkoo/japan-seasons-mcp";
const PUBLIC_JAPAN_SEASONS_MIRROR = "https://seasons.kooexperience.com/mcp";

// 60-second in-memory cache to prevent upstream rate-limiting & serverless timeouts
let cachedHealthPayload = null;
let cachedHealthExpiresAt = 0;

async function fetchWithTimeout(url, options = {}, timeoutMs = 2200) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function healthHandler(req, res) {
  try {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

    const forceRefresh = req?.query?.refresh === "true";
    if (!forceRefresh && cachedHealthPayload && Date.now() < cachedHealthExpiresAt) {
      return res.status(200).json({
        ...cachedHealthPayload,
        cached: true,
      });
    }

    const startedAt = Date.now();

    const checks = {
      weatherFeed: {
        endpoint: "/api/weather-seasons",
        upstream: "https://api.open-meteo.com/v1/forecast",
        status: "unknown",
        latencyMs: 0,
      },
      seasonsMcp: {
        endpoint: "/api/seasons/explore",
        mcpTarget: SMITHERY_JAPAN_SEASONS_MCP,
        status: "unknown",
        latencyMs: 0,
      },
      itineraryCuration: {
        endpoint: "/api/itinerary/curate",
        status: process.env.GEMINI_API_KEY ? "healthy" : "missing_api_key",
      },
      hiddenGemsSearch: {
        endpoint: "/api/discover/hidden-gems",
        status: process.env.GEMINI_API_KEY ? "healthy" : "missing_api_key",
      },
      voiceTranslationTts: {
        endpoint: "/api/translate-tts",
        status: process.env.GEMINI_API_KEY ? "healthy" : "missing_api_key",
      },
    };

    const checkWeather = async () => {
      const t0 = Date.now();
      try {
        const wRes = await fetchWithTimeout(
          "https://api.open-meteo.com/v1/forecast?latitude=35.0116&longitude=135.7681&current=temperature_2m",
          {},
          2200
        );
        checks.weatherFeed.status = wRes.ok ? "healthy" : `degraded_http_${wRes.status}`;
      } catch {
        checks.weatherFeed.status = "fallback_active";
      } finally {
        checks.weatherFeed.latencyMs = Date.now() - t0;
      }
    };

    const checkMcp = async () => {
      const t0 = Date.now();
      const mcpPayload = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {},
      });

      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        };
        if (process.env.SMITHERY_MCP_API_KEY) {
          headers.Authorization = `Bearer ${process.env.SMITHERY_MCP_API_KEY}`;
        }

        // Run Smithery target and public mirror check in parallel to avoid sequential timeout stacking
        const [primaryOutcome, mirrorOutcome] = await Promise.allSettled([
          fetchWithTimeout(
            SMITHERY_JAPAN_SEASONS_MCP,
            { method: "POST", headers, body: mcpPayload },
            2200
          ),
          fetchWithTimeout(
            PUBLIC_JAPAN_SEASONS_MIRROR,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json, text/event-stream",
              },
              body: mcpPayload,
            },
            2200
          ),
        ]);

        const primaryOk =
          primaryOutcome.status === "fulfilled" && primaryOutcome.value.ok;
        const mirrorOk =
          mirrorOutcome.status === "fulfilled" && mirrorOutcome.value.ok;
        const primaryAuthProtected =
          primaryOutcome.status === "fulfilled" && primaryOutcome.value.status === 401;

        if (primaryOk || mirrorOk || primaryAuthProtected) {
          checks.seasonsMcp.status = "healthy";
        } else {
          checks.seasonsMcp.status = "degraded";
        }
      } catch {
        checks.seasonsMcp.status = "unreachable";
      } finally {
        checks.seasonsMcp.latencyMs = Date.now() - t0;
      }
    };

    // Execute both upstream probes concurrently (max ~2.2s total wall-clock time)
    await Promise.allSettled([checkWeather(), checkMcp()]);

    const allHealthy =
      (checks.weatherFeed.status === "healthy" || checks.weatherFeed.status === "fallback_active") &&
      checks.seasonsMcp.status === "healthy" &&
      checks.itineraryCuration.status === "healthy";

    const payload = {
      ok: allHealthy,
      status: allHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      totalCheckDurationMs: Date.now() - startedAt,
      cached: false,
      services: checks,
    };

    cachedHealthPayload = payload;
    cachedHealthExpiresAt = Date.now() + 60000;

    return res.status(200).json(payload);
  } catch (err) {
    return res.status(200).json({
      ok: false,
      status: "degraded",
      timestamp: new Date().toISOString(),
      error: err?.message || "Health check fallback response",
    });
  }
}

export default healthHandler;
