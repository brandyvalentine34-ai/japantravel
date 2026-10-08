import { callJapanSeasonsMcpTool } from "../_shared.js";

export async function seasonsExploreHandler(req, res) {
  try {
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

    const {
      city = "Kyoto",
      month = 10,
      topic = "festivals",
    } = req.body || {};

    const mcpCity = city === "Naoshima" ? "Okayama" : city;
    let rawReport = null;

    if (topic === "festivals") {
      rawReport = await callJapanSeasonsMcpTool("festivals_list", {
        month: Number(month),
        prefecture: mcpCity === "Tokyo" || mcpCity === "Kyoto" ? mcpCity : undefined,
      });
    } else if (topic === "flowers") {
      rawReport = await callJapanSeasonsMcpTool("flowers_spots", {
        month: Number(month),
      });
    } else if (topic === "fruit") {
      rawReport = await callJapanSeasonsMcpTool("fruit_seasons", {
        month: Number(month),
      });
    } else {
      rawReport = await callJapanSeasonsMcpTool("japan_seasonal_answer", {
        question:
          topic === "koyo"
            ? `When and where is peak autumn foliage koyo in ${mcpCity}?`
            : `When and where is cherry blossom sakura viewing in ${mcpCity}?`,
        location: mcpCity,
        season: topic === "koyo" ? "koyo" : "sakura",
      });
    }

    return res.status(200).json({
      city,
      month,
      topic,
      report:
        rawReport ||
        "Seasonal forecast report is currently refreshing. Select a Japanese prefecture or month to inspect verified seasonal windows.",
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message || "Failed to fetch seasonal intelligence.",
    });
  }
}

export default seasonsExploreHandler;
