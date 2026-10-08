import { Type } from "@google/genai";
import { getAiClient, getCachedValue, setCachedValue } from "../_shared.js";

export async function curateItineraryHandler(req, res) {
  try {
    const {
      destination = "Kyoto",
      travelerGroup = "Couple",
      durationDays = 3,
      interests = ["After-Hours Temples", "Artisan Guilds", "Hidden Culinary"],
      pace = "Unhurried",
      weatherCondition = "Clear Sky",
      indoorPreferred = false,
    } = req.body || {};

    const cacheKey = `curate:${destination}:${travelerGroup}:${durationDays}:${interests.join(",")}:${pace}:${weatherCondition}:${indoorPreferred}`;
    const cached = getCachedValue(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const ai = getAiClient();
    const prompt = `Create a ${durationDays}-day bespoke, crowd-free itinerary for ${destination} tailored to a ${travelerGroup} seeking an "${pace}" pace.
Interests: ${interests.join(", ")}.
Current Weather Context: ${weatherCondition} (${indoorPreferred ? "Prioritize sheltered architectural sanctuaries, private tea rooms, and indoor craft studios due to rain/weather" : "Balance private outdoor dawn/twilight sanctuaries with intimate indoor artisan encounters"}).

Requirements:
1. Focus strictly on authentic, uncrowded, local experiences in ${destination} (after-hours temple or palace access, local hobby groups/artisan masters, quiet architectural stays, and point-to-point transport routes).
2. Avoid overcrowded mid-day tourist traps. Specify exact time windows (e.g., 06:30, 14:00, 19:30) and explain how each slot avoids crowds or adapts to the weather.
3. Include realistic estimated prices in USD (clearly marked as estimated/simulated rates) and exact point-to-point transport recommendations with transit duration.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            editorialSummary: { type: Type.STRING },
            weatherAdaptationNote: { type: Type.STRING },
            recommendedStay: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                neighborhood: { type: Type.STRING },
                style: { type: Type.STRING },
                estimatedNightlyUsd: { type: Type.NUMBER },
                whySelected: { type: Type.STRING },
              },
              required: ["name", "neighborhood", "style", "estimatedNightlyUsd", "whySelected"],
            },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  weatherContingency: { type: Type.STRING },
                  moments: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        timeSlot: { type: Type.STRING },
                        title: { type: Type.STRING },
                        category: { type: Type.STRING },
                        neighborhood: { type: Type.STRING },
                        description: { type: Type.STRING },
                        crowdLevel: { type: Type.STRING },
                        weatherFit: { type: Type.STRING },
                        hostName: { type: Type.STRING },
                        transportToNext: { type: Type.STRING },
                        estimatedCostUsd: { type: Type.NUMBER },
                        localPhraseNative: { type: Type.STRING },
                        localPhraseRomaji: { type: Type.STRING },
                        localPhraseMeaning: { type: Type.STRING },
                      },
                      required: [
                        "timeSlot",
                        "title",
                        "category",
                        "neighborhood",
                        "description",
                        "crowdLevel",
                        "weatherFit",
                        "hostName",
                        "transportToNext",
                        "estimatedCostUsd",
                        "localPhraseNative",
                        "localPhraseRomaji",
                        "localPhraseMeaning",
                      ],
                    },
                  },
                },
                required: ["dayNumber", "theme", "weatherContingency", "moments"],
              },
            },
          },
          required: ["title", "editorialSummary", "weatherAdaptationNote", "recommendedStay", "days"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from itinerary synthesis model.");
    }
    const parsed = JSON.parse(text);
    setCachedValue(cacheKey, parsed, 5 * 60 * 1000);
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({
      error: err?.message || "Failed to synthesize bespoke itinerary.",
    });
  }
}

export default curateItineraryHandler;
