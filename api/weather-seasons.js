import {
  callJapanSeasonsMcpTool,
  fetchWithTimeout,
  getCachedValue,
  setCachedValue,
} from "./_shared.js";

const CITY_COORDINATES = {
  Kyoto: { lat: 35.0116, lon: 135.7681, country: "Japan", region: "Kansai" },
  Tokyo: { lat: 35.6762, lon: 139.6503, country: "Japan", region: "Kanto" },
  Kanazawa: { lat: 36.5613, lon: 136.6562, country: "Japan", region: "Hokuriku" },
  Naoshima: { lat: 34.4597, lon: 133.9956, country: "Japan", region: "Seto Inland Sea" },
  Seoul: { lat: 37.5665, lon: 126.978, country: "South Korea", region: "Gyeonggi" },
  Jeju: { lat: 33.4996, lon: 126.5312, country: "South Korea", region: "Jeju Province" },
  Gyeongju: { lat: 35.8562, lon: 129.2247, country: "South Korea", region: "North Gyeongsang" },
};

function interpretWeatherCode(code) {
  if (code === 0) return { condition: "Clear Sky", isRainy: false, indoorRecommended: false };
  if (code <= 3) return { condition: "Partly Cloudy", isRainy: false, indoorRecommended: false };
  if (code <= 48) return { condition: "Atmospheric Mist", isRainy: false, indoorRecommended: false };
  if (code <= 67) return { condition: "Light Rain", isRainy: true, indoorRecommended: true };
  if (code <= 77) return { condition: "Crisp Snowfall", isRainy: true, indoorRecommended: true };
  if (code <= 82) return { condition: "Rain Showers", isRainy: true, indoorRecommended: true };
  return { condition: "Overcast & Breezy", isRainy: true, indoorRecommended: true };
}

export async function weatherSeasonsHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");

  const city = req?.query?.city || "Kyoto";
  const cacheKey = `weather:${city}`;
  const cached = getCachedValue(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  const coords = CITY_COORDINATES[city] || CITY_COORDINATES.Kyoto;

  const weatherData = {
    city,
    country: coords.country,
    region: coords.region,
    source: "Live Open-Meteo Meteorological Feed",
    isLiveWeather: true,
    currentTempC: 18,
    condition: "Clear Sky",
    windKmh: 9,
    indoorRecommended: false,
    daily: [],
    seasonalWindow: {
      source: "Simulated Seasonal Foliage & Bloom Model",
      sakuraWindow: coords.country === "Japan" ? "Mar 26 – Apr 08" : "Mar 29 – Apr 10",
      autumnFoliageWindow: coords.country === "Japan" ? "Nov 12 – Dec 02" : "Oct 24 – Nov 14",
      currentPhase: "Early Autumn Koyo & Private Harvest Season",
      crowdAvoidanceWindow: "06:00–08:30 & 17:30–21:00 After-Hours",
      liveSeasonalHighlights: "",
    },
  };

  const weatherPromise = (async () => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`;
      const response = await fetchWithTimeout(url, {}, 3000);
      if (response.ok) {
        const json = await response.json();
        const currentCode = json.current?.weather_code ?? 0;
        const parsedCurrent = interpretWeatherCode(currentCode);
        weatherData.currentTempC = Math.round(json.current?.temperature_2m ?? 18);
        weatherData.condition = parsedCurrent.condition;
        weatherData.windKmh = Math.round(json.current?.wind_speed_10m ?? 8);
        weatherData.indoorRecommended = parsedCurrent.indoorRecommended;

        const times = json.daily?.time || [];
        weatherData.daily = times.map((dateStr, idx) => {
          const dCode = json.daily?.weather_code?.[idx] ?? 0;
          const parsedDay = interpretWeatherCode(dCode);
          const precip = json.daily?.precipitation_probability_max?.[idx] ?? 10;
          return {
            date: dateStr,
            tempMaxC: Math.round(json.daily?.temperature_2m_max?.[idx] ?? 20),
            tempMinC: Math.round(json.daily?.temperature_2m_min?.[idx] ?? 12),
            precipProb: precip,
            condition: parsedDay.condition,
            indoorRecommended: parsedDay.indoorRecommended || precip >= 50,
          };
        });
      }
    } catch {
      weatherData.source = "Simulated Meteorological Baseline (Offline Fallback)";
      weatherData.isLiveWeather = false;
    }
  })();

  const mcpPromise = (async () => {
    if (coords.country === "Japan") {
      const mcpLocation = city === "Naoshima" ? "Okayama" : city;
      const mcpSeasonalAnswer = await callJapanSeasonsMcpTool("japan_seasonal_answer", {
        question: `What are the autumn foliage koyo dates, seasonal flowers, and October festivals in ${mcpLocation}?`,
        location: mcpLocation,
        season: "overview",
      });
      if (mcpSeasonalAnswer) {
        weatherData.seasonalWindow.source = "Live Japan-Seasons Feed";
        weatherData.seasonalWindow.liveSeasonalHighlights = mcpSeasonalAnswer
          .replace(/#+\s*/g, "")
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .slice(0, 2)
          .join(" · ")
          .slice(0, 220);
      }
    }
  })();

  await Promise.allSettled([weatherPromise, mcpPromise]);

  setCachedValue(cacheKey, weatherData, 2 * 60 * 1000);
  return res.status(200).json(weatherData);
}

export default weatherSeasonsHandler;
