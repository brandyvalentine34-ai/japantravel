import type { Request, Response } from "express";
import { Type } from "@google/genai";
import { getAiClient } from "./shared.ts";

export async function discoverHiddenGemsHandler(req: Request, res: Response) {
  try {
    const { city = "Kyoto", query = "quiet neighborhood craft coffee and ceramics studio" } = req.body;
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
      .map((c: any) => ({
        title: c.web?.title || "Verified Web Source",
        uri: c.web?.uri || "",
      }))
      .filter((s: any) => Boolean(s.uri));

    const parsed = JSON.parse(response.text || '{"spots":[]}');
    res.json({
      spots: parsed.spots || [],
      sources,
    });
  } catch (err: any) {
    res.status(500).json({
      error: err?.message || "Failed to search live local spots.",
    });
  }
}
