import type { Request, Response } from "express";
import { Type } from "@google/genai";
import { getAiClient } from "./shared.ts";

export async function translateTtsHandler(req: Request, res: Response) {
  try {
    const {
      text = "Thank you for welcoming our family into your studio this evening.",
      targetLanguage = "Japanese",
      contextNote = "Speaking respectfully to a master artisan or host",
    } = req.body;

    const ai = getAiClient();

    const translationResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Translate the following traveler message into polite, natural ${targetLanguage} appropriate for: ${contextNote}.
Message: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nativeScript: { type: Type.STRING },
            romanization: { type: Type.STRING },
            literalMeaning: { type: Type.STRING },
            culturalEtiquetteTip: { type: Type.STRING },
          },
          required: ["nativeScript", "romanization", "literalMeaning", "culturalEtiquetteTip"],
        },
      },
    });

    const translated = JSON.parse(translationResponse.text || "{}");

    let audioBase64: string | null = null;
    try {
      const ttsResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: translated.nativeScript || text,
                speechMetadata: {
                  style: "Warm, respectful, calm native speaker",
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" },
            },
          },
        },
      });

      audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch {
      audioBase64 = null;
    }

    res.json({
      ...translated,
      audioBase64,
    });
  } catch (err: any) {
    res.status(500).json({
      error: err?.message || "Translation service encountered an error.",
    });
  }
}
