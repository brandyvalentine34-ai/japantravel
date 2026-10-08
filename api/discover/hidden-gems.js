import { Type } from "@google/genai";
import { getAiClient, getCachedValue, setCachedValue } from "../_shared.js";

export async function discoverHiddenGemsHandler(req, res) {
  try {
    const {
      city = "Kyoto",
      query = "quiet neighborhood craft coffee and ceramics studio",
    } = req.body || {};

    const cacheKey = `discover:${city}:${query}`;
    const cached = getCachedValue(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Find 3 authentic, lesser-known local spots or cultural experiences in ${city} matching: "${query}".
Avoid mainstream mass-tourist landmarks. Focus on independent ateliers, quiet neighborhood tea houses, small architectural galleries, or local hobby circles.
Return JSON with an array of 3 spots, including name, neighborhood, category, whyItIsSpecial, bestTimeWindow, estimatedCostNote, and a polite local phrase to use when visiting.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            spots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  neighborhood: { type: Type.STRING },
                  category: { type: Type.STRING },
                  whyItIsSpecial: { type: Type.STRING },
                  bestTimeWindow: { type: Type.STRING },
                  estimatedCostNote: { type: Type.STRING },
                  etiquetteTip: { type: Type.STRING },
                },
                required: [
                  "name",
                  "neighborhood",
                  "category",
                  "whyItIsSpecial",
                  "bestTimeWindow",
                  "estimatedCostNote",
                  "etiquetteTip",
                ],
              },
            },
          },
          required: ["spots"],
        },
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((c) => ({
        title: c.web?.title || "Verified Web Source",
        uri: c.web?.uri || "",
      }))
      .filter((s) => Boolean(s.uri));

    const parsed = JSON.parse(response.text || '{"spots":[]}');
    const result = {
      spots: parsed.spots || [],
      sources,
    };
    setCachedValue(cacheKey, result, 5 * 60 * 1000);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      error: err?.message || "Failed to search live local spots.",
    });
  }
}

export default discoverHiddenGemsHandler;
