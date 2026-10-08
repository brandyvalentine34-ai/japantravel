import { Router } from "express";
import { healthHandler } from "./health.js";
import { weatherSeasonsHandler, seasonsExploreHandler } from "./weatherSeasons.ts";
import { curateItineraryHandler } from "./itinerary.ts";
import { discoverHiddenGemsHandler } from "./discover.ts";
import { translateTtsHandler } from "./translateTts.ts";

export const apiRouter = Router();

apiRouter.get("/health", healthHandler);
apiRouter.get("/weather-seasons", weatherSeasonsHandler);
apiRouter.post("/seasons/explore", seasonsExploreHandler);
apiRouter.post("/itinerary/curate", curateItineraryHandler);
apiRouter.post("/discover/hidden-gems", discoverHiddenGemsHandler);
apiRouter.post("/translate-tts", translateTtsHandler);
