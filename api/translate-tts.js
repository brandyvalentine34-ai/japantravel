import { Type } from "@google/genai";
import { getAiClient, getCachedValue, setCachedValue } from "./_shared.js";

export async function translateTtsHandler(req, res) {
  try {
    const {
      text = "Thank you for welcoming our family into your studio this evening.",
      targetLanguage = "Japanese",
      contextNote = "Speaking respectfully to a master artisan or host",
    } = req.body || {};

    const cacheKey = `tts:${targetLanguage}:${contextNote}:${text}`;
    const cached = getCachedValue(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

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

    let audioBase64 = null;
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

    const result = {
      ...translated,
      audioBase64,
    };
    setCachedValue(cacheKey, result, 10 * 60 * 1000);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      error: err?.message || "Translation service encountered an error.",
    });
  }
}

export default translateTtsHandler;
