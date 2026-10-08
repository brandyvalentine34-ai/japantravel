import { GoogleGenAI } from "@google/genai";

export const SMITHERY_JAPAN_SEASONS_MCP = "https://server.smithery.ai/haomingkoo/japan-seasons-mcp";
export const PUBLIC_JAPAN_SEASONS_MIRROR = "https://seasons.kooexperience.com/mcp";

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

export async function callJapanSeasonsMcpTool(
  toolName: string,
  args: Record<string, any>
): Promise<string | null> {
  const payload = JSON.stringify({
    jsonrpc: "2.0",
    id: Date.now(),
    method: "tools/call",
    params: {
      name: toolName,
      arguments: args,
    },
  });

  const parseMcpResponseText = (raw: string): string | null => {
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
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    };
    if (process.env.SMITHERY_MCP_API_KEY) {
      headers.Authorization = `Bearer ${process.env.SMITHERY_MCP_API_KEY}`;
    }
    const primaryRes = await fetch(SMITHERY_JAPAN_SEASONS_MCP, {
      method: "POST",
      headers,
      body: payload,
      signal: AbortSignal.timeout(4500),
    });
    if (primaryRes.ok) {
      const rawText = await primaryRes.text();
      const extracted = parseMcpResponseText(rawText);
      if (extracted) return extracted;
    }
  } catch {
    // Proceed to upstream mirror
  }

  // 2. Fallback to haomingkoo/japan-seasons-mcp public upstream instance if Smithery requires OAuth token
  try {
    const mirrorRes = await fetch(PUBLIC_JAPAN_SEASONS_MIRROR, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: payload,
      signal: AbortSignal.timeout(5500),
    });
    if (mirrorRes.ok) {
      const rawText = await mirrorRes.text();
      return parseMcpResponseText(rawText);
    }
  } catch {
    return null;
  }
  return null;
}
