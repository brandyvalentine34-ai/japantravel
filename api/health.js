import { SMITHERY_JAPAN_SEASONS_MCP, PUBLIC_JAPAN_SEASONS_MIRROR } from "./shared.ts";

/**
 * Health monitoring handler for all application APIs and upstream services.
 * Accessible at GET /api/health
 */
export async function healthHandler(_req, res) {
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

  // 1. Check Open-Meteo Weather Feed
  const weatherStart = Date.now();
  try {
    const wRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=35.0116&longitude=135.7681&current=temperature_2m",
      { signal: AbortSignal.timeout(3500) }
    );
    checks.weatherFeed.status = wRes.ok ? "healthy" : `degraded_http_${wRes.status}`;
    checks.weatherFeed.latencyMs = Date.now() - weatherStart;
  } catch {
    checks.weatherFeed.status = "fallback_active";
    checks.weatherFeed.latencyMs = Date.now() - weatherStart;
  }

  // 2. Check Japan-Seasons MCP availability
  const mcpStart = Date.now();
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    };
    if (process.env.SMITHERY_MCP_API_KEY) {
      headers.Authorization = `Bearer ${process.env.SMITHERY_MCP_API_KEY}`;
    }

    const mcpPayload = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
      params: {},
    });

    const primaryRes = await fetch(SMITHERY_JAPAN_SEASONS_MCP, {
      method: "POST",
      headers,
      body: mcpPayload,
      signal: AbortSignal.timeout(3500),
    });

    if (primaryRes.ok) {
      checks.seasonsMcp.status = "healthy";
    } else {
      // Verify upstream public mirror for japan-seasons-mcp
      const mirrorRes = await fetch(PUBLIC_JAPAN_SEASONS_MIRROR, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: mcpPayload,
        signal: AbortSignal.timeout(4000),
      });
      checks.seasonsMcp.status = mirrorRes.ok ? "healthy" : `degraded_http_${primaryRes.status}`;
    }
    checks.seasonsMcp.latencyMs = Date.now() - mcpStart;
  } catch {
    checks.seasonsMcp.status = "unreachable";
    checks.seasonsMcp.latencyMs = Date.now() - mcpStart;
  }

  const allHealthy =
    checks.weatherFeed.status === "healthy" &&
    checks.seasonsMcp.status === "healthy" &&
    checks.itineraryCuration.status === "healthy";

  res.status(200).json({
    ok: allHealthy,
    status: allHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    totalCheckDurationMs: Date.now() - startedAt,
    services: checks,
  });
}

export default healthHandler;
