import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { healthHandler } from "./api/health.js";
import { weatherSeasonsHandler } from "./api/weather-seasons.js";
import { seasonsExploreHandler } from "./api/seasons/explore.js";
import { curateItineraryHandler } from "./api/itinerary/curate.js";
import { discoverHiddenGemsHandler } from "./api/discover/hidden-gems.js";
import { translateTtsHandler } from "./api/translate-tts.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "2mb" }));

// Mount Vercel-compatible API handlers in local Express server
app.get("/api/health", healthHandler);
app.get("/api/weather-seasons", weatherSeasonsHandler);
app.post("/api/seasons/explore", seasonsExploreHandler);
app.post("/api/itinerary/curate", curateItineraryHandler);
app.post("/api/discover/hidden-gems", discoverHiddenGemsHandler);
app.post("/api/translate-tts", translateTtsHandler);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kanso server listening on http://localhost:${PORT}`);
  });
}

startServer();
