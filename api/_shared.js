import { GoogleGenAI } from "@google/genai";

export const SMITHERY_JAPAN_SEASONS_MCP = "https://server.smithery.ai/haomingkoo/japan-seasons-mcp";
export const PUBLIC_JAPAN_SEASONS_MIRROR = "https://seasons.kooexperience.com/mcp";

// Simple in-memory cache & rate-limit protection for serverless and Express runtimes
const responseCache = new Map();

export function getCachedValue(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry.value;
}

export function setCachedValue(key, value, ttlMs = 60000) {
  responseCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export function getAiClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = 2500) {
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

export async function callJapanSeasonsMcpTool(toolName, args) {
  const cacheKey = `mcp:${toolName}:${JSON.stringify(args)}`;
  const cached = getCachedValue(cacheKey);
  if (cached) return cached;

  const payload = JSON.stringify({
    jsonrpc: "2.0",
    id: Date.now(),
    method: "tools/call",
    params: {
      name: toolName,
      arguments: args,
    },
  });

  const parseMcpResponseText = (raw) => {
    const lines = raw.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data:")) {
        try {
          const parsed = JSON.parse(trimmed.slice(5).trim());
          const answer =
            parsed?.result?.structuredContent?.answer ||
            parsed?.result?.content?.[0]?.text;
          if (answer) return String(answer);
        } catch {
          // continue
        }
      }
    }
    try {
      const parsed = JSON.parse(raw);
      return (
        parsed?.result?.structuredContent?.answer ||
        parsed?.result?.content?.[0]?.text ||
        null
      );
    } catch {
      return null;
    }
  };

  // 1. Primary attempt: https://server.smithery.ai/haomingkoo/japan-seasons-mcp
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    };
    if (process.env.SMITHERY_MCP_API_KEY) {
      headers.Authorization = `Bearer ${process.env.SMITHERY_MCP_API_KEY}`;
    }
    const primaryRes = await fetchWithTimeout(
      SMITHERY_JAPAN_SEASONS_MCP,
      {
        method: "POST",
        headers,
        body: payload,
      },
      3000
    );
    if (primaryRes.ok) {
      const rawText = await primaryRes.text();
      const extracted = parseMcpResponseText(rawText);
      if (extracted) {
        setCachedValue(cacheKey, extracted, 5 * 60 * 1000);
        return extracted;
      }
    }
  } catch {
    // Proceed to upstream mirror
  }

  // 2. Fallback to haomingkoo/japan-seasons-mcp public upstream instance if Smithery requires OAuth token
  try {
    const mirrorRes = await fetchWithTimeout(
      PUBLIC_JAPAN_SEASONS_MIRROR,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: payload,
      },
      3500
    );
    if (mirrorRes.ok) {
      const rawText = await mirrorRes.text();
      const extracted = parseMcpResponseText(rawText);
      if (extracted) {
        setCachedValue(cacheKey, extracted, 5 * 60 * 1000);
        return extracted;
      }
    }
  } catch {
    return null;
  }
  return null;
}
