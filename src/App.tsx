import React, { useEffect, useState } from "react";
import {
  Compass,
  Calendar,
  Volume2,
  BookmarkCheck,
  CloudRain,
  Sun,
  Wind,
  ArrowRight,
  Clock,
  Users,
  MapPin,
  Train,
  Home,
  Search,
  Check,
  X,
  MessageCircle,
  Send,
  RefreshCw,
  VolumeX,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Heart,
} from "lucide-react";
import {
  HERO_ASSET,
  CURATED_SANCTUARIES,
  TRANSPORT_CORRIDORS,
  ESSENTIAL_PHRASES,
  SanctuaryItem,
} from "./data/sanctuaries";
import { ResilientImage } from "./components/ResilientImage";

type ActiveTab = "sanctuaries" | "atelier" | "voice" | "passport";

interface WeatherSeasonsResponse {
  city: string;
  country: "Japan" | "South Korea";
  region: string;
  source: string;
  isLiveWeather: boolean;
  currentTempC: number;
  condition: string;
  windKmh: number;
  indoorRecommended: boolean;
  daily: Array<{
    date: string;
    tempMaxC: number;
    tempMinC: number;
    precipProb: number;
    condition: string;
    indoorRecommended: boolean;
  }>;
  seasonalWindow: {
    source: string;
    sakuraWindow: string;
    autumnFoliageWindow: string;
    currentPhase: string;
    crowdAvoidanceWindow: string;
    liveSeasonalHighlights?: string;
  };
}

interface GeneratedItinerary {
  title: string;
  editorialSummary: string;
  weatherAdaptationNote: string;
  recommendedStay: {
    name: string;
    neighborhood: string;
    style: string;
    estimatedNightlyUsd: number;
    whySelected: string;
  };
  days: Array<{
    dayNumber: number;
    theme: string;
    weatherContingency: string;
    moments: Array<{
      timeSlot: string;
      title: string;
      category: string;
      neighborhood: string;
      description: string;
      crowdLevel: string;
      weatherFit: string;
      hostName: string;
      transportToNext: string;
      estimatedCostUsd: number;
      localPhraseNative: string;
      localPhraseRomaji: string;
      localPhraseMeaning: string;
    }>;
  }>;
}

interface DiscoveredGem {
  name: string;
  neighborhood: string;
  category: string;
  whyItIsSpecial: string;
  bestTimeWindow: string;
  estimatedCostNote: string;
  etiquetteTip: string;
}

interface SavedReservation {
  id: string;
  title: string;
  city: string;
  timeWindow: string;
  hostName: string;
  partyType: string;
  guestsCount: number;
  dateSelected: string;
  simulatedPriceUsd: number;
  gratitudeTipUsd: number;
  channelPreference: "WhatsApp" | "WeChat" | "Telegram";
  contactHandle: string;
  status: "Confirmed Request (Simulated)";
}

const DEFAULT_ITINERARY: GeneratedItinerary = {
  title: "Kyoto Twilight Sub-Temples & Artisans of Murasakino",
  editorialSummary:
    "Designed for unhurried immersion away from mid-day tour buses. This 3-day sequence pairs private 18:00 cedar-gate temple access with 4th-generation lacquerware and tea guilds, connected via quiet northern neighborhood lanes.",
  weatherAdaptationNote:
    "Adapted for current conditions: morning moss walks take advantage of crisp early clarity, while afternoon craft sessions are sheltered inside heated earthen kura studios.",
  recommendedStay: {
    name: "Murasakino Cedar Machiya Sanctuary",
    neighborhood: "Kita Ward · 6 min walk from Daitoku-ji",
    style: "Restored 1912 private timber townhouse with hinoki bath & moss courtyard",
    estimatedNightlyUsd: 310,
    whySelected:
      "Located in Kyoto's quiet northern temple quarter, eliminating congested cross-town bus transfers during peak hours.",
  },
  days: [
    {
      dayNumber: 1,
      theme: "After-Hours Stone Gardens & Northern Tea Hearth",
      weatherContingency: "Covered hinoki engawa verandas protect all evening contemplation corridors if light rain arrives.",
      moments: [
        {
          timeSlot: "16:00",
          title: "Private Check-In & Uji Gyokuro Welcome",
          category: "Architectural Stay",
          neighborhood: "Murasakino",
          description:
            "Settle into your private machiya townhouse as daytime excursion groups begin departing northern Kyoto.",
          crowdLevel: "Zero crowds · Private residence",
          weatherFit: "Indoor courtyard view",
          hostName: "Sato-san (House Curator)",
          transportToNext: "6 min lantern walk along stone lane",
          estimatedCostUsd: 0,
          localPhraseNative: "お世話になります。",
          localPhraseRomaji: "Osewa ni narimasu.",
          localPhraseMeaning: "Thank you for taking care of us during our stay.",
        },
        {
          timeSlot: "18:00",
          title: "Daitoku-ji Sub-Temple Private Lantern Viewing",
          category: "After-Hours Access",
          neighborhood: "Kita Ward",
          description:
            "Enter behind locked public gates with Associate Abbot Takahashi for 90 minutes of silent dry-landscape contemplation and whisked matcha.",
          crowdLevel: "Max 6 guests · 0 public visitors",
          weatherFit: "All-Weather Sheltered Veranda",
          hostName: "Rev. Kenji Takahashi",
          transportToNext: "8 min walk to hidden counter kappo",
          estimatedCostUsd: 165,
          localPhraseNative: "静かなお時間をありがとうございます。",
          localPhraseRomaji: "Shizuka na ojikan wo arigatou gozaimasu.",
          localPhraseMeaning: "Thank you for sharing this quiet moment with us.",
        },
      ],
    },
    {
      dayNumber: 2,
      theme: "Dawn Bamboo Grove & Nishijin Textile Hobby Circle",
      weatherContingency: "If precipitation exceeds 50%, dawn walk shifts to Rokuon-ji covered shoin study and private kimono weaving loft.",
      moments: [
        {
          timeSlot: "06:15",
          title: "First-Light Tenryu-ji North Gate & Saga Toriimoto Walk",
          category: "Private Guide",
          neighborhood: "Saga-Arashiyama",
          description:
            "Walk the preserved Edo-period thatched merchant street of Saga Toriimoto two hours before tourist trains arrive.",
          crowdLevel: "Quiet dawn window (<10 locals)",
          weatherFit: "Crisp Morning Outdoor",
          hostName: "Haruka Nishimura (Architectural Historian)",
          transportToNext: "18 min Private EV Taxi to Nishijin District",
          estimatedCostUsd: 140,
          localPhraseNative: "朝の空気がとても清々しいですね。",
          localPhraseRomaji: "Asa no kuuki ga totemo sugasugashii desu ne.",
          localPhraseMeaning: "The morning air is wonderfully refreshing.",
        },
        {
          timeSlot: "14:30",
          title: "Nishijin Silk & Natural Indigo Hobby Guild Session",
          category: "Local Hobby Guild",
          neighborhood: "Kamigyo Ward",
          description:
            "Sit beside Kyoto textile hobbyists and master weavers inside a quiet machiya loom studio while afternoon crowds peak downtown.",
          crowdLevel: "Private 4-seat atelier",
          weatherFit: "100% Indoor Sanctuary",
          hostName: "Master Yoko Fujita & Guild",
          transportToNext: "10 min walk to Kitaoji dining room",
          estimatedCostUsd: 130,
          localPhraseNative: "美しい藍染めの色ですね。",
          localPhraseRomaji: "Utsukushii aizome no iro desu ne.",
          localPhraseMeaning: "What a deeply beautiful indigo color.",
        },
      ],
    },
    {
      dayNumber: 3,
      theme: "Higashiyama Mountain Hermitage & Ceramic Kiln Walk",
      weatherContingency: "Indoor climbing-kiln studio and private tea room available throughout the afternoon.",
      moments: [
        {
          timeSlot: "08:30",
          title: "Honen-in Moss Gate & Hidden Mountain Stream Path",
          category: "After-Hours Access",
          neighborhood: "Sakyo Ward · Shishigatani",
          description:
            "Bypass the crowded Philosopher's Path main canal and ascend the quiet forest trail behind Honen-in's thatched sand mounds.",
          crowdLevel: "Serene neighborhood sanctuary",
          weatherFit: "Canopy-sheltered moss path",
          hostName: "Kenjiro Mori (Botanist & Local Guide)",
          transportToNext: "15 min sedan transfer to Kyoto Station Green Car Lounge",
          estimatedCostUsd: 115,
          localPhraseNative: "苔の緑がとても鮮やかですね。",
          localPhraseRomaji: "Koke no midori ga totemo azayaka desu ne.",
          localPhraseMeaning: "The green of the moss is remarkably vivid.",
        },
      ],
    },
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("sanctuaries");

  // Filtering state for Sanctuaries view
  const [countryFilter, setCountryFilter] = useState<"All" | "Japan" | "South Korea">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [weatherModeFilter, setWeatherModeFilter] = useState<"All" | "Rain-Safe Indoor">("All");

  // Live weather & seasonal feed state
  const [selectedWeatherCity, setSelectedWeatherCity] = useState<string>("Kyoto");
  const [weatherData, setWeatherData] = useState<WeatherSeasonsResponse | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);

  // Selected Sanctuary Modal / Detail Sheet
  const [selectedSanctuary, setSelectedSanctuary] = useState<SanctuaryItem | null>(null);

  // Reservation & Concierge Request Drawer inside Detail Sheet
  const [bookingPartyType, setBookingPartyType] = useState<string>("Couple");
  const [bookingGuests, setBookingGuests] = useState<number>(2);
  const [bookingDate, setBookingDate] = useState<string>("2026-10-24");
  const [bookingChannel, setBookingChannel] = useState<"WhatsApp" | "WeChat" | "Telegram">("WhatsApp");
  const [bookingHandle, setBookingHandle] = useState<string>("");
  const [bookingTipUsd, setBookingTipUsd] = useState<number>(20);
  const [bookingConfirmedBanner, setBookingConfirmedBanner] = useState<string | null>(null);

  // Saved Passport State
  const [savedReservations, setSavedReservations] = useState<SavedReservation[]>([
    {
      id: "res-initial-1",
      title: "Daitoku-ji Sub-Temple Private Lantern Viewing",
      city: "Kyoto",
      timeWindow: "18:00 – 20:00 (After Public Closing)",
      hostName: "Rev. Kenji Takahashi",
      partyType: "Couple",
      guestsCount: 2,
      dateSelected: "2026-10-24",
      simulatedPriceUsd: 165,
      gratitudeTipUsd: 25,
      channelPreference: "WhatsApp",
      contactHandle: "+41 79 555 0192",
      status: "Confirmed Request (Simulated)",
    },
  ]);

  // Traveler direct feedback state
  const [feedbackAuthor, setFeedbackAuthor] = useState<string>("");
  const [feedbackTripType, setFeedbackTripType] = useState<string>("Family");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [feedbackList, setFeedbackList] = useState<
    Array<{ author: string; tripType: string; message: string; hostReply: string; timestamp: string }>
  >([
    {
      author: "Liam & Chloe T.",
      tripType: "Couple · Kyoto & Naoshima",
      message: "The 18:00 sub-temple lantern entry and the rain-day swap to the Kanazawa gold-leaf studio saved us from every single tour bus.",
      hostReply: "Warmest thanks from Abbot Takahashi and our Kyoto curation team—we are delighted the twilight rain made the moss garden glow.",
      timestamp: "2 days ago",
    },
  ]);

  // Atelier (Bespoke Itinerary Builder + Live Search Grounding) State
  const [atelierCity, setAtelierCity] = useState<string>("Kyoto");
  const [atelierGroup, setAtelierGroup] = useState<string>("Couple");
  const [atelierDays, setAtelierDays] = useState<number>(3);
  const [atelierPace, setAtelierPace] = useState<string>("Unhurried");
  const [atelierInterests, setAtelierInterests] = useState<string[]>([
    "After-Hours Temples",
    "Local Hobby Guilds",
  ]);
  const [atelierIndoorRainOverride, setAtelierIndoorRainOverride] = useState<boolean>(false);
  const [activeDayTab, setActiveDayTab] = useState<number>(1);
  const [itineraryData, setItineraryData] = useState<GeneratedItinerary>(DEFAULT_ITINERARY);
  const [itineraryLoading, setItineraryLoading] = useState<boolean>(false);
  const [itineraryError, setItineraryError] = useState<string | null>(null);

  // Live Hidden Gem Search (Google Search Grounding)
  const [gemSearchQuery, setGemSearchQuery] = useState<string>(
    "quiet independent ceramic studio or hidden kissaten away from crowds"
  );
  const [discoveredGems, setDiscoveredGems] = useState<DiscoveredGem[]>([]);
  const [gemSources, setGemSources] = useState<Array<{ title: string; uri: string }>>([]);
  const [gemsLoading, setGemsLoading] = useState<boolean>(false);
  const [gemsError, setGemsError] = useState<string | null>(null);

  // Live Seasonal Almanac (Festivals, Koyo, Sakura, Flowers, Fruit Seasons)
  const [seasonTopic, setSeasonTopic] = useState<"festivals" | "koyo" | "sakura" | "flowers" | "fruit">("festivals");
  const [seasonMonth, setSeasonMonth] = useState<number>(10);
  const [seasonalReport, setSeasonalReport] = useState<string>("");
  const [seasonLoading, setSeasonLoading] = useState<boolean>(false);

  // Voice & Cultural Translation Bridge State
  const [voiceInputText, setVoiceInputText] = useState<string>(
    "Thank you for welcoming our family into your studio after hours this evening."
  );
  const [voiceTargetLang, setVoiceTargetLang] = useState<"Japanese" | "Korean">("Japanese");
  const [voiceContext, setVoiceContext] = useState<string>("Speaking respectfully to a master artisan or temple host");
  const [translationResult, setTranslationResult] = useState<{
    nativeScript: string;
    romanization: string;
    literalMeaning: string;
    culturalEtiquetteTip: string;
    audioBase64: string | null;
  }>({
    nativeScript: "今夜は閉門後の工房に私たち家族を温かくお迎えいただき、心より感謝いたします。",
    romanization:
      "Kon'ya wa heimon-go no koubou ni watashitachi kazoku wo atatakaku omukae itadaki, kokoro yori kansha itashimasu.",
    literalMeaning:
      "We sincerely thank you from the bottom of our hearts for warmly welcoming our family into your studio after closing hours tonight.",
    culturalEtiquetteTip:
      "Offer a calm 15-degree bow before speaking; in traditional ateliers, soft-spoken gratitude creates an immediate personal bond.",
    audioBase64: null,
  });
  const [voiceLoading, setVoiceLoading] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Fetch live meteorological and seasonal forecast whenever selectedWeatherCity changes
  useEffect(() => {
    let ignore = false;
    async function loadWeather() {
      setWeatherLoading(true);
      try {
        const res = await fetch(`/api/weather-seasons?city=${encodeURIComponent(selectedWeatherCity)}`);
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setWeatherData(data);
          }
        }
      } catch {
        // Fallback handled gracefully
      } finally {
        if (!ignore) setWeatherLoading(false);
      }
    }
    loadWeather();
    return () => {
      ignore = true;
    };
  }, [selectedWeatherCity]);

  // Filtered sanctuaries
  const filteredSanctuaries = CURATED_SANCTUARIES.filter((item) => {
    if (countryFilter !== "All" && item.country !== countryFilter) return false;
    if (categoryFilter !== "All" && item.category !== categoryFilter) return false;
    if (weatherModeFilter === "Rain-Safe Indoor" && item.weatherSuitability === "Clear Sky Best") return false;
    return true;
  });

  // Toggle interest in Atelier
  const toggleInterest = (interest: string) => {
    setAtelierInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // Curate bespoke itinerary via backend Gemini API
  const handleCurateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setItineraryLoading(true);
    setItineraryError(null);
    try {
      const response = await fetch("/api/itinerary/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: atelierCity,
          travelerGroup: atelierGroup,
          durationDays: atelierDays,
          interests: atelierInterests.length ? atelierInterests : ["After-Hours Temples", "Local Hobby Guilds"],
          pace: atelierPace,
          weatherCondition: weatherData?.condition || "Clear Sky",
          indoorPreferred: atelierIndoorRainOverride || Boolean(weatherData?.indoorRecommended),
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Unable to generate custom itinerary right now.");
      }
      setItineraryData(data);
      setActiveDayTab(1);
    } catch (err: any) {
      setItineraryError(err?.message || "Could not reach curation server.");
    } finally {
      setItineraryLoading(false);
    }
  };

  // Discover live hidden gems via Google Search Grounding
  const handleSearchHiddenGems = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gemSearchQuery.trim()) return;
    setGemsLoading(true);
    setGemsError(null);
    try {
      const response = await fetch("/api/discover/hidden-gems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: atelierCity,
          query: gemSearchQuery,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to search local spots.");
      }
      setDiscoveredGems(data.spots || []);
      setGemSources(data.sources || []);
    } catch (err: any) {
      setGemsError(err?.message || "Live search temporarily unavailable.");
    } finally {
      setGemsLoading(false);
    }
  };

  // Query Live Seasonal Almanac (Festivals, Koyo, Sakura, Flowers, Fruit)
  const handleExploreSeasonalAlmanac = async (
    nextTopic = seasonTopic,
    nextMonth = seasonMonth,
    nextCity = atelierCity
  ) => {
    setSeasonLoading(true);
    try {
      const res = await fetch("/api/seasons/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: nextCity,
          month: nextMonth,
          topic: nextTopic,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSeasonalReport(data.report || "");
      }
    } catch {
      // Handled gracefully
    } finally {
      setSeasonLoading(false);
    }
  };

  // Translate & Speak with Gemini TTS + Web Speech fallback
  const handleTranslateAndSpeak = async (e?: React.FormEvent, customPhrase?: { text: string; lang: "Japanese" | "Korean" }) => {
    if (e) e.preventDefault();
    const textToUse = customPhrase ? customPhrase.text : voiceInputText;
    const langToUse = customPhrase ? customPhrase.lang : voiceTargetLang;

    if (!textToUse.trim()) return;
    setVoiceLoading(true);
    setVoiceError(null);

    try {
      const response = await fetch("/api/translate-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToUse,
          targetLanguage: langToUse,
          contextNote: voiceContext,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Translation failed.");
      }
      setTranslationResult(data);
      playSpokenOutput(data.nativeScript, langToUse, data.audioBase64);
    } catch (err: any) {
      setVoiceError(err?.message || "Unable to complete translation.");
    } finally {
      setVoiceLoading(false);
    }
  };

  const playSpokenOutput = (nativeText: string, lang: "Japanese" | "Korean", audioBase64?: string | null) => {
    if (audioBase64) {
      try {
        setIsPlayingAudio(true);
        const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          setIsPlayingAudio(false);
          fallbackWebSpeech(nativeText, lang);
        };
        audio.play().catch(() => {
          setIsPlayingAudio(false);
          fallbackWebSpeech(nativeText, lang);
        });
        return;
      } catch {
        setIsPlayingAudio(false);
      }
    }
    fallbackWebSpeech(nativeText, lang);
  };

  const fallbackWebSpeech = (nativeText: string, lang: "Japanese" | "Korean") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(nativeText);
      utterance.lang = lang === "Japanese" ? "ja-JP" : "ko-KR";
      utterance.rate = 0.92;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle saving a sanctuary reservation into Passport
  const handleConfirmSanctuaryReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSanctuary) return;
    const handleVal = bookingHandle.trim() || "Direct Concierge Dispatch";
    const newReservation: SavedReservation = {
      id: `res-${Date.now()}`,
      title: selectedSanctuary.title,
      city: selectedSanctuary.city,
      timeWindow: selectedSanctuary.timeWindow,
      hostName: selectedSanctuary.hostName,
      partyType: bookingPartyType,
      guestsCount: bookingGuests,
      dateSelected: bookingDate,
      simulatedPriceUsd: selectedSanctuary.simulatedPriceUsd * bookingGuests,
      gratitudeTipUsd: bookingTipUsd,
      channelPreference: bookingChannel,
      contactHandle: handleVal,
      status: "Confirmed Request (Simulated)",
    };
    setSavedReservations((prev) => [newReservation, ...prev]);
    setBookingConfirmedBanner(
      `Private request logged for ${selectedSanctuary.title}. Dispatch dossier queued via ${bookingChannel}.`
    );
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackAuthor.trim() || !feedbackMessage.trim()) return;
    setFeedbackList((prev) => [
      {
        author: feedbackAuthor.trim(),
        tripType: feedbackTripType,
        message: feedbackMessage.trim(),
        hostReply:
          "Thank you for your direct feedback. Our local Kyoto & Seoul host guild has logged your note for upcoming seasonal curation.",
        timestamp: "Just now",
      },
      ...prev,
    ]);
    setFeedbackAuthor("");
    setFeedbackMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#111215] pb-20 md:pb-0">
      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-30 h-14 bg-[#F7F7F5]/90 backdrop-blur-md border-b border-black/[0.07] px-4 sm:px-8 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("sanctuaries");
          }}
          className="font-serif-display text-2xl tracking-tight text-[#111215] whitespace-nowrap shrink-0"
        >
          Kanso
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5A5E66]">
          <button
            type="button"
            onClick={() => setActiveTab("sanctuaries")}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === "sanctuaries"
                ? "text-[#111215] border-[#1B4332]"
                : "border-transparent hover:text-[#111215]"
            }`}
          >
            Sanctuaries
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("atelier")}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === "atelier"
                ? "text-[#111215] border-[#1B4332]"
                : "border-transparent hover:text-[#111215]"
            }`}
          >
            Itinerary Atelier
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("voice")}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === "voice"
                ? "text-[#111215] border-[#1B4332]"
                : "border-transparent hover:text-[#111215]"
            }`}
          >
            Voice Bridge
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("passport")}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === "passport"
                ? "text-[#111215] border-[#1B4332]"
                : "border-transparent hover:text-[#111215]"
            }`}
          >
            Passport ({savedReservations.length})
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("atelier")}
            className="px-4 py-2 min-h-[40px] text-xs font-semibold text-white bg-[#1B4332] rounded-xl hover:bg-[#143325] transition-colors whitespace-nowrap shrink-0"
          >
            Design Journey
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="top" className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-8 pt-6 pb-16">
        {/* Live Weather & Seasonal Rhythm Strip (Always accessible, quiet editorial bar) */}
        <section
          aria-label="Live Meteorological and Seasonal Conditions"
          className="mb-8 bg-[#EFECE6] border border-black/[0.07] rounded-2xl p-4 sm:px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-[#1B4332] tracking-tight">
              Meteorological & Seasonal Rhythm
            </span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <div className="flex items-center gap-1 bg-[#F7F7F5] p-1 rounded-xl border border-black/[0.06]">
              {(["Kyoto", "Seoul", "Kanazawa", "Jeju", "Naoshima"] as const).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setSelectedWeatherCity(city);
                    setAtelierCity(city);
                  }}
                  className={`px-3 py-1.5 min-h-[36px] text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedWeatherCity === city
                      ? "bg-[#111215] text-white"
                      : "text-[#5A5E66] hover:text-[#111215]"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {weatherData && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5A5E66] tabular-nums">
              <span className="font-medium text-[#111215] flex items-center gap-1.5">
                {weatherData.indoorRecommended ? (
                  <CloudRain className="w-3.5 h-3.5 text-[#1B4332]" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-[#1B4332]" />
                )}
                {weatherData.city}: {weatherData.currentTempC}°C {weatherData.condition}
              </span>
              <span aria-hidden="true">·</span>
              <span>Wind {weatherData.windKmh} km/h</span>
              <span aria-hidden="true">·</span>
              <span>Autumn Koyo: {weatherData.seasonalWindow.autumnFoliageWindow}</span>
              <span aria-hidden="true">·</span>
              <span>Sakura: {weatherData.seasonalWindow.sakuraWindow}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1B4332] font-medium">
                {weatherLoading ? "Refreshing feed..." : weatherData.source}
              </span>
            </div>
          )}
        </section>

        {/* =========================================================
            TAB 1: SANCTUARIES (PROPOSITION, AFTER-HOURS & HOBBY GUILDS)
           ========================================================= */}
        {activeTab === "sanctuaries" && (
          <div className="space-y-14">
            {/* Hero Section — Single Dominant Focal Anchor */}
            <section className="relative rounded-3xl overflow-hidden border border-black/[0.08] bg-[#111215]">
              <div className="relative h-[420px] sm:h-[500px] w-full">
                <ResilientImage
                  src={HERO_ASSET}
                  alt="Quiet Kyoto temple stone pathway illuminated by warm lanterns after public closing hours"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />

                <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end max-w-3xl">
                  <div className="text-xs text-stone-300 mb-3 flex flex-wrap items-center gap-2">
                    <span>Korea & Japan Private Access</span>
                    <span aria-hidden="true">·</span>
                    <span>After-Hours Sanctuaries</span>
                    <span aria-hidden="true">·</span>
                    <span>Local Hobby Guilds</span>
                  </div>
                  <h1 className="font-serif-display text-3xl sm:text-5xl text-white leading-[1.1] tracking-tight mb-4">
                    When the day crowds depart, the real sanctuary opens.
                  </h1>
                  <p className="text-sm sm:text-base text-stone-200 leading-relaxed mb-6 max-w-2xl">
                    Curated after-hours temple access, intimate neighborhood craft circles, weather-adaptive itineraries, and point-to-point quiet transit for discerning solo travelers, couples, and families.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("atelier")}
                      className="px-6 py-3 min-h-[48px] bg-white text-[#111215] rounded-xl text-sm font-semibold hover:bg-stone-100 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                      <span>Curate Your Weather-Adaptive Itinerary</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("curated-roster");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-5 py-3 min-h-[48px] bg-white/15 text-white backdrop-blur-md border border-white/25 rounded-xl text-sm font-medium hover:bg-white/25 transition-colors whitespace-nowrap shrink-0"
                    >
                      Explore Private Sanctuaries
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter Controls & Curated Sanctuaries Roster */}
            <section id="curated-roster" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/[0.07] pb-5">
                <div>
                  <h2 className="font-serif-display text-3xl sm:text-4xl text-[#111215]">
                    01. Curated After-Hours & Local Guild Access
                  </h2>
                  <p className="text-sm text-[#5A5E66] mt-1">
                    Verified local hosts, small-group hobby circles, and private evening entries. All pricing shown reflects transparent simulated partner estimates.
                  </p>
                </div>

                {/* Interactive Filter Segmented Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 p-1 bg-[#EFECE6] rounded-xl">
                    {(["All", "Japan", "South Korea"] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCountryFilter(c)}
                        className={`px-3 py-1.5 min-h-[38px] text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                          countryFilter === c
                            ? "bg-white text-[#111215] shadow-xs"
                            : "text-[#5A5E66] hover:text-[#111215]"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-[#EFECE6] rounded-xl">
                    {(["All", "After-Hours Access", "Local Hobby Guild", "Private Guide", "Architectural Stay"] as const).map(
                      (cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-3 py-1.5 min-h-[38px] text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                            categoryFilter === cat
                              ? "bg-white text-[#111215] shadow-xs"
                              : "text-[#5A5E66] hover:text-[#111215]"
                          }`}
                        >
                          {cat === "All" ? "All Types" : cat}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setWeatherModeFilter((prev) =>
                        prev === "All" ? "Rain-Safe Indoor" : "All"
                      )
                    }
                    className={`px-3.5 py-2 min-h-[38px] text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      weatherModeFilter === "Rain-Safe Indoor"
                        ? "bg-[#1B4332] text-white border-[#1B4332]"
                        : "bg-white text-[#5A5E66] border-black/[0.08] hover:text-[#111215]"
                    }`}
                  >
                    <CloudRain className="w-3.5 h-3.5" />
                    <span>Rain-Safe Only</span>
                  </button>
                </div>
              </div>

              {/* Sanctuary Grid — Single-Elevation Depth, Zero-Pill Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSanctuaries.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => {
                      setSelectedSanctuary(item);
                      setBookingConfirmedBanner(null);
                    }}
                    className="group cursor-pointer bg-white rounded-2xl border border-black/[0.07] overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="relative h-56 w-full overflow-hidden bg-stone-900">
                        <ResilientImage
                          src={item.image}
                          alt={item.title}
                          fallbackTitle={item.city}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-stone-100 tabular-nums">
                          <span>{item.timeWindow}</span>
                          <span className="font-semibold">
                            Est. ${item.simulatedPriceUsd} / guest (Simulated)
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        {/* Unboxed quiet metadata line */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#5A5E66]">
                          <span className="font-medium text-[#1B4332]">{item.city}, {item.country}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.weatherSuitability}</span>
                        </div>

                        <h3 className="font-serif-display text-2xl text-[#111215] leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-sm text-[#5A5E66] leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-black/[0.05] space-y-2.5">
                      <div className="text-xs text-[#5A5E66] flex items-center justify-between tabular-nums">
                        <span>Host: {item.hostName}</span>
                        <span>Max {item.maxGuests} guests</span>
                      </div>
                      <div className="text-xs text-[#1B4332] font-medium flex items-center justify-between">
                        <span>{item.crowdMetric}</span>
                        <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Inspect Dossier <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Section 02: Point-to-Point Quiet Transit & Stay Pairing */}
            <section className="pt-6 border-t border-black/[0.07] space-y-6">
              <div className="max-w-2xl">
                <h2 className="font-serif-display text-3xl sm:text-4xl text-[#111215]">
                  02. Door-to-Door Quiet Transit & Sanctuary Stays
                </h2>
                <p className="text-sm text-[#5A5E66] mt-1">
                  We plan not only the destinations, but the calmest rail corridors, low-cost flight benchmarks, and architectural stays that eliminate peak-hour station congestion.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {TRANSPORT_CORRIDORS.map((corridor) => (
                  <div
                    key={corridor.id}
                    className="bg-white rounded-2xl border border-black/[0.07] p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between text-xs text-[#5A5E66] tabular-nums">
                      <span className="font-semibold text-[#1B4332]">{corridor.country} Corridor</span>
                      <span>Simulated Route Benchmark</span>
                    </div>

                    <h3 className="font-serif-display text-2xl text-[#111215]">
                      {corridor.corridor}
                    </h3>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-semibold text-[#111215]">
                          Primary Curated Route: {corridor.recommendedOption.mode}
                        </span>
                        <span className="font-mono text-xs tabular-nums text-[#1B4332] font-medium shrink-0 ml-2">
                          {corridor.recommendedOption.duration} · Est. ${corridor.recommendedOption.estimatedCostUsd}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A5E66]">
                        {corridor.recommendedOption.crowdAdvantage}
                      </p>
                      <ul className="space-y-1.5 pt-2 text-xs text-[#111215]">
                        {corridor.recommendedOption.routeSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-mono text-[#1B4332] tabular-nums">0{idx + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5A5E66]">
                      <div>
                        <span className="font-medium text-[#111215]">Low-Cost Flight Benchmark: </span>
                        <span>{corridor.alternativeBudgetOption.mode}</span>
                      </div>
                      <span className="font-mono tabular-nums shrink-0">
                        {corridor.alternativeBudgetOption.duration} · Est. ${corridor.alternativeBudgetOption.estimatedCostUsd}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 03: Verified Traveler Proof & Direct Host Feedback */}
            <section className="pt-6 border-t border-black/[0.07] grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-serif-display text-3xl text-[#111215]">
                  03. Direct Traveler & Host Exchanges
                </h2>
                <p className="text-sm text-[#5A5E66]">
                  Transparent feedback from solo travelers, couples, and families who used our after-hours entries and local hobby guild introductions, paired with direct host responses.
                </p>

                <div className="space-y-4 pt-2">
                  {feedbackList.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-black/[0.07] p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs text-[#5A5E66]">
                        <span className="font-semibold text-[#111215]">{item.author}</span>
                        <span>
                          {item.tripType} · {item.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-[#111215] leading-relaxed">
                        “{item.message}”
                      </p>
                      <div className="pt-3 border-t border-black/[0.05] text-xs text-[#1B4332]">
                        <span className="font-semibold">Direct Host Response: </span>
                        <span>{item.hostReply}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <form
                  onSubmit={handleFeedbackSubmit}
                  className="bg-white rounded-2xl border border-black/[0.07] p-6 space-y-4"
                >
                  <h3 className="font-serif-display text-2xl text-[#111215]">
                    Share Direct Feedback with Our Guilds
                  </h3>
                  <p className="text-xs text-[#5A5E66]">
                    Your note goes directly to our Kyoto, Kanazawa, Seoul, and Jeju local coordinators.
                  </p>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#111215]">
                      Your Name & City
                    </label>
                    <input
                      type="text"
                      required
                      value={feedbackAuthor}
                      onChange={(e) => setFeedbackAuthor(e.target.value)}
                      placeholder="e.g., Mei & Arthur · Vancouver"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F7F5] border border-black/[0.1] rounded-xl focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#111215]">
                      Party & Destination
                    </label>
                    <select
                      value={feedbackTripType}
                      onChange={(e) => setFeedbackTripType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F7F5] border border-black/[0.1] rounded-xl focus:outline-none focus:border-[#1B4332]"
                    >
                      <option value="Couple · Kyoto & Kanazawa">Couple · Kyoto & Kanazawa</option>
                      <option value="Family · Seoul & Jeju">Family · Seoul & Jeju</option>
                      <option value="Solo Traveler · Naoshima & Kyoto">Solo Traveler · Naoshima & Kyoto</option>
                      <option value="Corporate Incentive Retreat">Corporate Incentive Retreat</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#111215]">
                      Experience Reflection or Question
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Share how the after-hours timing or local guild host shaped your journey..."
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F7F5] border border-black/[0.1] rounded-xl focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 min-h-[44px] bg-[#111215] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors"
                  >
                    Post Direct Traveler Note
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================
            TAB 2: ITINERARY ATELIER (BESPOKE WEATHER-AWARE PLANNER + LIVE GEM SEARCH)
           ========================================================= */}
        {activeTab === "atelier" && (
          <div className="space-y-12">
            <div className="max-w-3xl">
              <div className="text-xs text-[#1B4332] font-medium mb-2">
                Personalised Weather-Aware Curation · Route & Stay Integration
              </div>
              <h1 className="font-serif-display text-3xl sm:text-5xl text-[#111215]">
                Bespoke Itinerary Atelier
              </h1>
              <p className="text-sm sm:text-base text-[#5A5E66] mt-2">
                Tailor an uncrowded day-by-day sequence for individuals, couples, or families. Automatically factors in live local weather, after-hours sight windows, architectural stays, and door-to-door transit.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Configurator Form */}
              <form
                onSubmit={handleCurateItinerary}
                className="lg:col-span-4 bg-white rounded-2xl border border-black/[0.07] p-6 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                  <h2 className="font-serif-display text-2xl text-[#111215]">
                    Journey Parameters
                  </h2>
                  <SlidersHorizontal className="w-4 h-4 text-[#5A5E66]" />
                </div>

                {/* Destination */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#111215]">
                    Primary Sanctuary City
                  </label>
                  <select
                    value={atelierCity}
                    onChange={(e) => {
                      setAtelierCity(e.target.value);
                      setSelectedWeatherCity(e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F7F5] border border-black/[0.1] rounded-xl focus:outline-none focus:border-[#1B4332]"
                  >
                    <option value="Kyoto">Kyoto, Japan (Kansai)</option>
                    <option value="Kanazawa">Kanazawa, Japan (Hokuriku Craft)</option>
                    <option value="Naoshima">Naoshima, Japan (Seto Inland Sea)</option>
                    <option value="Tokyo">Tokyo, Japan (Quiet Neighborhoods)</option>
                    <option value="Seoul">Seoul, South Korea (Bukchon & Seochon)</option>
                    <option value="Jeju">Jeju Island, South Korea (Volcanic Coast)</option>
                    <option value="Gyeongju">Gyeongju, South Korea (Silla Heritage)</option>
                  </select>
                </div>

                {/* Party Type */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#111215]">
                    Traveler Party
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Solo Individual", "Couple", "Family (Multi-Gen)", "Private Group"].map(
                      (group) => (
                        <button
                          key={group}
                          type="button"
                          onClick={() => setAtelierGroup(group)}
                          className={`px-3 py-2 min-h-[40px] text-xs font-medium rounded-xl border transition-colors whitespace-nowrap truncate ${
                            atelierGroup === group
                              ? "bg-[#111215] text-white border-[#111215]"
                              : "bg-[#F7F7F5] text-[#5A5E66] border-black/[0.06] hover:text-[#111215]"
                          }`}
                        >
                          {group}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Duration & Pace */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#111215]">
                      Duration
                    </label>
                    <select
                      value={atelierDays}
                      onChange={(e) => setAtelierDays(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F7F5] border border-black/[0.1] rounded-xl"
                    >
                      <option value={2}>2 Days</option>
                      <option value={3}>3 Days</option>
                      <option value={4}>4 Days</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#111215]">
                      Rhythm & Pace
                    </label>
                    <select
                      value={atelierPace}
                      onChange={(e) => setAtelierPace(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F7F5] border border-black/[0.1] rounded-xl"
                    >
                      <option value="Unhurried">Unhurried</option>
                      <option value="Contemplative">Contemplative</option>
                      <option value="Adventurous">Adventurous</option>
                    </select>
                  </div>
                </div>

                {/* Curated Interests */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#111215]">
                    Curated Access Focus
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "After-Hours Temples",
                      "Local Hobby Guilds",
                      "Private Tea & Ceramics",
                      "Hidden Culinary",
                      "Architectural Stays",
                      "Dawn Nature Walks",
                    ].map((interest) => {
                      const active = atelierInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3 py-1.5 min-h-[36px] text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                            active
                              ? "bg-[#1B4332] text-white border-[#1B4332]"
                              : "bg-[#F7F7F5] text-[#5A5E66] border-black/[0.08] hover:text-[#111215]"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Weather Element Override Toggle */}
                <div className="p-3.5 bg-[#EFECE6] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#111215]">
                      Weather-Contingency Mode
                    </span>
                    <button
                      type="button"
                      onClick={() => setAtelierIndoorRainOverride((v) => !v)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        atelierIndoorRainOverride
                          ? "bg-[#1B4332] text-white"
                          : "bg-white text-[#5A5E66]"
                      }`}
                    >
                      {atelierIndoorRainOverride ? "Rain-Safe Active" : "Auto-Detect"}
                    </button>
                  </div>
                  <p className="text-xs text-[#5A5E66]">
                    {weatherData
                      ? `Live ${weatherData.city}: ${weatherData.currentTempC}°C (${weatherData.condition}). ${
                          atelierIndoorRainOverride || weatherData.indoorRecommended
                            ? "Prioritizing sheltered temples & indoor craft guilds."
                            : "Balancing dawn outdoor sanctuaries with afternoon studios."
                        }`
                      : "Automatically shifts outdoor walks to sheltered tea rooms and ateliers during rain."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={itineraryLoading}
                  className="w-full py-3.5 min-h-[48px] bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#143325] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {itineraryLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Bespoke Dossier...</span>
                    </>
                  ) : (
                    <>
                      <span>Synthesize Personalised Itinerary</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {itineraryError && (
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    {itineraryError}
                  </p>
                )}
              </form>

              {/* Right Column: Generated Itinerary Output */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-2xl border border-black/[0.07] p-6 sm:p-8 space-y-6">
                  <div className="space-y-2 border-b border-black/[0.06] pb-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A5E66]">
                      <span className="font-semibold text-[#1B4332]">{atelierCity} Bespoke Dossier</span>
                      <span aria-hidden="true">·</span>
                      <span>Tailored for {atelierGroup}</span>
                      <span aria-hidden="true">·</span>
                      <span>{atelierPace} Pace</span>
                    </div>
                    <h2 className="font-serif-display text-3xl sm:text-4xl text-[#111215]">
                      {itineraryData.title}
                    </h2>
                    <p className="text-sm text-[#5A5E66] leading-relaxed">
                      {itineraryData.editorialSummary}
                    </p>
                    <p className="text-xs text-[#1B4332] pt-1">
                      Weather & Seasonal Note: {itineraryData.weatherAdaptationNote}
                    </p>
                  </div>

                  {/* Recommended Architectural Stay Pairing */}
                  <div className="bg-[#F7F7F5] rounded-xl p-4 sm:p-5 border border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-[#5A5E66] flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-[#1B4332]" />
                        <span>Recommended Architectural Stay Pairing</span>
                        <span aria-hidden="true">·</span>
                        <span>{itineraryData.recommendedStay.neighborhood}</span>
                      </div>
                      <h3 className="font-serif-display text-xl text-[#111215]">
                        {itineraryData.recommendedStay.name}
                      </h3>
                      <p className="text-xs text-[#5A5E66]">
                        {itineraryData.recommendedStay.style} — {itineraryData.recommendedStay.whySelected}
                      </p>
                    </div>
                    <div className="text-left sm:text-right shrink-0 tabular-nums">
                      <div className="font-mono text-sm font-semibold text-[#111215]">
                        Est. ${itineraryData.recommendedStay.estimatedNightlyUsd} / night
                      </div>
                      <div className="text-[11px] text-[#5A5E66]">Simulated Partner Rate</div>
                    </div>
                  </div>

                  {/* Day Selector Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {itineraryData.days.map((d) => (
                      <button
                        key={d.dayNumber}
                        type="button"
                        onClick={() => setActiveDayTab(d.dayNumber)}
                        className={`px-4 py-2 min-h-[42px] rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          activeDayTab === d.dayNumber
                            ? "bg-[#111215] text-white"
                            : "bg-[#EFECE6] text-[#5A5E66] hover:text-[#111215]"
                        }`}
                      >
                        Day 0{d.dayNumber}: {d.theme}
                      </button>
                    ))}
                  </div>

                  {/* Active Day Moments */}
                  {itineraryData.days
                    .filter((d) => d.dayNumber === activeDayTab)
                    .map((day) => (
                      <div key={day.dayNumber} className="space-y-5">
                        <div className="text-xs text-[#5A5E66] flex items-center justify-between border-b border-black/[0.05] pb-3">
                          <span>Weather Contingency: {day.weatherContingency}</span>
                        </div>

                        <div className="space-y-4">
                          {day.moments.map((moment, idx) => (
                            <div
                              key={idx}
                              className="p-5 rounded-2xl bg-[#F7F7F5] border border-black/[0.06] space-y-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A5E66] tabular-nums">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-semibold text-[#1B4332]">
                                    {moment.timeSlot}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>{moment.category}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{moment.neighborhood}</span>
                                </div>
                                <span className="font-mono">
                                  {moment.estimatedCostUsd > 0
                                    ? `Est. $${moment.estimatedCostUsd} (Simulated)`
                                    : "Included in Stay"}
                                </span>
                              </div>

                              <h4 className="font-serif-display text-2xl text-[#111215]">
                                {moment.title}
                              </h4>

                              <p className="text-sm text-[#5A5E66] leading-relaxed">
                                {moment.description}
                              </p>

                              <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#111215]">
                                <span>
                                  <strong className="font-medium text-[#5A5E66]">Crowd Window:</strong>{" "}
                                  {moment.crowdLevel}
                                </span>
                                <span aria-hidden="true" className="text-stone-300">·</span>
                                <span>
                                  <strong className="font-medium text-[#5A5E66]">Host:</strong>{" "}
                                  {moment.hostName}
                                </span>
                                <span aria-hidden="true" className="text-stone-300">·</span>
                                <span>
                                  <strong className="font-medium text-[#5A5E66]">Transit Next:</strong>{" "}
                                  {moment.transportToNext}
                                </span>
                              </div>

                              {/* Integrated Local Phrase & Instant Voice Trigger */}
                              <div className="pt-3 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="text-xs">
                                  <span className="text-[#5A5E66]">Host Greeting: </span>
                                  <span className="font-medium text-[#111215]">
                                    {moment.localPhraseNative}
                                  </span>{" "}
                                  <span className="text-[#5A5E66] italic">
                                    ({moment.localPhraseRomaji}) — “{moment.localPhraseMeaning}”
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    playSpokenOutput(
                                      moment.localPhraseNative,
                                      ["Seoul", "Jeju", "Gyeongju"].includes(atelierCity)
                                        ? "Korean"
                                        : "Japanese",
                                      null
                                    )
                                  }
                                  className="px-3 py-1.5 min-h-[36px] bg-white border border-black/[0.08] rounded-lg text-xs font-medium text-[#1B4332] hover:bg-[#EFECE6] transition-colors flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap shrink-0"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>Speak Phrase</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Live Web Grounding: Off-the-Beaten-Path Gem Finder */}
                <div className="bg-white rounded-2xl border border-black/[0.07] p-6 sm:p-8 space-y-5">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-[#1B4332]">
                      Live Web Grounding · Off-the-Beaten-Path Discovery
                    </div>
                    <h3 className="font-serif-display text-2xl sm:text-3xl text-[#111215]">
                      Search Current Local Subcultures & Hidden Micro-Spots
                    </h3>
                    <p className="text-xs text-[#5A5E66]">
                      Uses live Google Search grounding to surface independent ateliers, neighborhood listening bars (jazz kissa), and quiet local spots in {atelierCity}.
                    </p>
                  </div>

                  <form onSubmit={handleSearchHiddenGems} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={gemSearchQuery}
                      onChange={(e) => setGemSearchQuery(e.target.value)}
                      placeholder="e.g., vinyl jazz kissaten, woodblock print workshop, or quiet mountain temple..."
                      className="flex-1 px-4 py-3 text-sm bg-[#F7F7F5] border border-black/[0.1] rounded-xl focus:outline-none focus:border-[#1B4332]"
                    />
                    <button
                      type="submit"
                      disabled={gemsLoading}
                      className="px-5 py-3 min-h-[46px] bg-[#111215] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-60"
                    >
                      <Search className="w-4 h-4" />
                      <span>{gemsLoading ? "Searching Live Web..." : `Search ${atelierCity} Gems`}</span>
                    </button>
                  </form>

                  {gemsError && (
                    <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                      {gemsError}
                    </p>
                  )}

                  {discoveredGems.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {discoveredGems.map((gem, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-[#F7F7F5] border border-black/[0.06] flex flex-col justify-between space-y-3"
                          >
                            <div className="space-y-2">
                              <div className="text-xs text-[#5A5E66]">
                                <span className="font-medium text-[#1B4332]">{gem.neighborhood}</span>
                                <span aria-hidden="true"> · </span>
                                <span>{gem.category}</span>
                              </div>
                              <h4 className="font-serif-display text-xl text-[#111215]">
                                {gem.name}
                              </h4>
                              <p className="text-xs text-[#5A5E66] leading-relaxed">
                                {gem.whyItIsSpecial}
                              </p>
                            </div>
                            <div className="pt-3 border-t border-black/[0.05] text-[11px] text-[#5A5E66] space-y-1">
                              <div>
                                <strong className="text-[#111215]">Calm Window:</strong> {gem.bestTimeWindow}
                              </div>
                              <div>
                                <strong className="text-[#111215]">Est. Spend:</strong> {gem.estimatedCostNote}
                              </div>
                              <div>
                                <strong className="text-[#111215]">Etiquette:</strong> {gem.etiquetteTip}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {gemSources.length > 0 && (
                        <div className="text-xs text-[#5A5E66] flex flex-wrap items-center gap-2 pt-2">
                          <span className="font-medium text-[#111215]">Live Grounding Citations:</span>
                          {gemSources.slice(0, 4).map((s, i) => (
                            <a
                              key={i}
                              href={s.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-[#1B4332] truncate max-w-[220px]"
                            >
                              {s.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Live Japan Seasonal Almanac (Sakura, Autumn Foliage Koyo, Matsuri Festivals, Flowers & Fruit Picking) */}
                <div className="bg-white rounded-2xl border border-black/[0.07] p-6 sm:p-8 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-[#1B4332]">
                        Live Seasonal Intelligence · Sakura, Autumn Foliage & Matsuri Almanac
                      </div>
                      <h3 className="font-serif-display text-2xl sm:text-3xl text-[#111215]">
                        Verify Seasonal Bloom Windows, Festivals & Harvests
                      </h3>
                    </div>

                    <select
                      value={seasonMonth}
                      onChange={(e) => {
                        const m = Number(e.target.value);
                        setSeasonMonth(m);
                        handleExploreSeasonalAlmanac(seasonTopic, m, atelierCity);
                      }}
                      className="px-3.5 py-2 min-h-[40px] text-xs font-medium bg-[#F7F7F5] border border-black/[0.1] rounded-xl self-start sm:self-center"
                    >
                      <option value={3}>March (Early Sakura & Plum)</option>
                      <option value={4}>April (Peak Sakura & Spring Matsuri)</option>
                      <option value={5}>May (Wisteria & Fresh Tea)</option>
                      <option value={7}>July (Gion Matsuri & Summer Festivals)</option>
                      <option value={10}>October (Autumn Matsuri & Early Koyo)</option>
                      <option value={11}>November (Peak Autumn Foliage Koyo)</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(
                      [
                        { id: "festivals", label: "Seasonal Festivals (Matsuri)" },
                        { id: "koyo", label: "Autumn Foliage (Koyo)" },
                        { id: "sakura", label: "Cherry Blossoms (Sakura)" },
                        { id: "flowers", label: "Botanical & Flower Sanctuaries" },
                        { id: "fruit", label: "Orchard & Fruit Harvests" },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setSeasonTopic(tab.id);
                          handleExploreSeasonalAlmanac(tab.id, seasonMonth, atelierCity);
                        }}
                        className={`px-3.5 py-2 min-h-[38px] text-xs font-medium rounded-xl border transition-colors whitespace-nowrap shrink-0 ${
                          seasonTopic === tab.id
                            ? "bg-[#111215] text-white border-[#111215]"
                            : "bg-[#F7F7F5] text-[#5A5E66] border-black/[0.08] hover:text-[#111215]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleExploreSeasonalAlmanac(seasonTopic, seasonMonth, atelierCity)}
                      disabled={seasonLoading}
                      className="px-4 py-2 min-h-[38px] bg-[#1B4332] text-white text-xs font-semibold rounded-xl hover:bg-[#143325] transition-colors whitespace-nowrap shrink-0"
                    >
                      {seasonLoading ? "Querying Almanac..." : "Load Live Seasonal Data"}
                    </button>
                  </div>

                  {seasonalReport ? (
                    <div className="p-5 rounded-2xl bg-[#F7F7F5] border border-black/[0.06] text-xs text-[#111215] leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto font-sans">
                      {seasonalReport}
                    </div>
                  ) : (
                    <p className="text-xs text-[#5A5E66]">
                      Select any seasonal category above and click <strong>Load Live Seasonal Data</strong> to inspect real-time Japan Meteorological Corporation bloom dates, <em>koyo</em> foliage windows, regional <em>matsuri</em> festivals, and seasonal orchard calendars.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: VOICE BRIDGE (CULTURAL TRANSLATION & LIVE TEXT-TO-SPEECH)
           ========================================================= */}
        {activeTab === "voice" && (
          <div className="space-y-10">
            <div className="max-w-3xl">
              <div className="text-xs font-semibold text-[#1B4332] mb-2">
                Japanese & Korean Honorific Voice Bridge · Text-to-Speech
              </div>
              <h1 className="font-serif-display text-3xl sm:text-5xl text-[#111215]">
                Converse Warmly with Local Artisans & Sanctuary Hosts
              </h1>
              <p className="text-sm sm:text-base text-[#5A5E66] mt-2">
                Many 4th-generation craft masters, sub-temple custodians, and neighborhood hobby circles speak primarily Japanese or Korean. Translate your thoughts into culturally respectful phrasing and play natural spoken audio aloud.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Interactive Translator + TTS */}
              <form
                onSubmit={(e) => handleTranslateAndSpeak(e)}
                className="lg:col-span-6 bg-white rounded-2xl border border-black/[0.07] p-6 sm:p-8 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-display text-2xl text-[#111215]">
                    Live Cultural Translator & Speech
                  </h2>
                  <div className="flex items-center gap-1 p-1 bg-[#EFECE6] rounded-xl">
                    {(["Japanese", "Korean"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setVoiceTargetLang(lang)}
                        className={`px-3 py-1.5 min-h-[36px] text-xs font-medium rounded-lg transition-colors ${
                          voiceTargetLang === lang
                            ? "bg-white text-[#111215] shadow-xs"
                            : "text-[#5A5E66]"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#111215]">
                    Social & Cultural Context
                  </label>
                  <select
                    value={voiceContext}
                    onChange={(e) => setVoiceContext(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F7F5] border border-black/[0.1] rounded-xl"
                  >
                    <option value="Speaking respectfully to a master artisan or temple host">
                      Speaking respectfully to a master artisan or temple host
                    </option>
                    <option value="Greeting members of a local neighborhood hobby circle">
                      Greeting members of a local neighborhood hobby circle
                    </option>
                    <option value="Asking a chef about seasonal ingredients or dietary preferences">
                      Asking a chef about seasonal ingredients or dietary preferences
                    </option>
                    <option value="Giving quiet drop-off directions to a private taxi driver">
                      Giving quiet drop-off directions to a private taxi driver
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#111215]">
                    What would you like to express?
                  </label>
                  <textarea
                    rows={3}
                    value={voiceInputText}
                    onChange={(e) => setVoiceInputText(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-[#F7F7F5] border border-black/[0.1] rounded-xl focus:outline-none focus:border-[#1B4332]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={voiceLoading}
                  className="w-full py-3.5 min-h-[48px] bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#143325] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {voiceLoading
                      ? "Synthesizing Honorific Speech..."
                      : `Translate & Speak in ${voiceTargetLang}`}
                  </span>
                </button>

                {voiceError && (
                  <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    {voiceError}
                  </p>
                )}

                {/* Output Card */}
                <div className="p-5 rounded-2xl bg-[#F7F7F5] border border-black/[0.07] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1B4332]">
                      {voiceTargetLang} Honorific Phrasing
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        playSpokenOutput(
                          translationResult.nativeScript,
                          voiceTargetLang,
                          translationResult.audioBase64
                        )
                      }
                      className="px-3 py-1.5 min-h-[36px] bg-[#111215] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-stone-800 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingAudio ? "Speaking Aloud..." : "Replay Audio"}</span>
                    </button>
                  </div>

                  <p className="font-serif-display text-2xl sm:text-3xl text-[#111215] leading-snug">
                    {translationResult.nativeScript}
                  </p>

                  <p className="font-mono text-xs text-[#1B4332]">
                    {translationResult.romanization}
                  </p>

                  <div className="pt-2 border-t border-black/[0.06] text-xs text-[#5A5E66] space-y-1">
                    <div>
                      <strong className="text-[#111215]">Nuance:</strong> {translationResult.literalMeaning}
                    </div>
                    <div>
                      <strong className="text-[#111215]">Etiquette Note:</strong>{" "}
                      {translationResult.culturalEtiquetteTip}
                    </div>
                  </div>
                </div>
              </form>

              {/* Right: Curated Essential Sanctuary Phrases */}
              <div className="lg:col-span-6 space-y-4">
                <h2 className="font-serif-display text-2xl text-[#111215]">
                  Essential Sanctuary & Guild Phrasebook
                </h2>
                <p className="text-xs text-[#5A5E66]">
                  Tap any card to play spoken pronunciation immediately during your temple visit, hobby session, or private transfer.
                </p>

                <div className="space-y-3">
                  {ESSENTIAL_PHRASES.map((phrase) => (
                    <div
                      key={phrase.id}
                      className="bg-white rounded-2xl border border-black/[0.07] p-5 space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs text-[#5A5E66]">
                        <span>
                          <strong className="text-[#1B4332]">{phrase.language}</strong> · {phrase.category}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            playSpokenOutput(phrase.native, phrase.language, null)
                          }
                          className="px-3 py-1.5 min-h-[38px] bg-[#EFECE6] hover:bg-[#1B4332] hover:text-white text-[#111215] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>
                      </div>

                      <p className="font-serif-display text-2xl text-[#111215]">
                        {phrase.native}
                      </p>
                      <p className="font-mono text-xs text-[#1B4332]">{phrase.romaji}</p>
                      <p className="text-xs text-[#111215] font-medium">“{phrase.english}”</p>
                      <p className="text-xs text-[#5A5E66] pt-1 border-t border-black/[0.05]">
                        Etiquette: {phrase.etiquette}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: PASSPORT (SAVED RESERVATIONS, WHATSAPP/WECHAT DISPATCH, CORPORATE & HOST GRATITUDE)
           ========================================================= */}
        {activeTab === "passport" && (
          <div className="space-y-12">
            <div className="max-w-3xl">
              <div className="text-xs font-semibold text-[#1B4332] mb-2">
                Confirmed Dossier · WhatsApp / WeChat / Telegram Concierge · Host Gratitude
              </div>
              <h1 className="font-serif-display text-3xl sm:text-5xl text-[#111215]">
                Your Sanctuary Passport
              </h1>
              <p className="text-sm sm:text-base text-[#5A5E66] mt-2">
                Review your private after-hours access requests, direct local host communication channels, and optional artisan gratitude contributions. All bookings and prices are clearly labeled as simulated MVP records.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                <h2 className="font-serif-display text-2xl text-[#111215]">
                  Logged Private Access Requests ({savedReservations.length})
                </h2>

                {savedReservations.map((resItem) => (
                  <div
                    key={resItem.id}
                    className="bg-white rounded-2xl border border-black/[0.07] p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A5E66] tabular-nums">
                      <span>
                        <strong className="text-[#1B4332]">{resItem.city}</strong> · {resItem.dateSelected} ·{" "}
                        {resItem.timeWindow}
                      </span>
                      <span className="font-medium text-[#1B4332] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {resItem.status}
                      </span>
                    </div>

                    <h3 className="font-serif-display text-2xl text-[#111215]">
                      {resItem.title}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs tabular-nums">
                      <div>
                        <div className="text-[#5A5E66]">Local Host</div>
                        <div className="font-medium text-[#111215]">{resItem.hostName}</div>
                      </div>
                      <div>
                        <div className="text-[#5A5E66]">Party</div>
                        <div className="font-medium text-[#111215]">
                          {resItem.partyType} ({resItem.guestsCount} guests)
                        </div>
                      </div>
                      <div>
                        <div className="text-[#5A5E66]">Direct Channel</div>
                        <div className="font-medium text-[#111215]">
                          {resItem.channelPreference} ({resItem.contactHandle})
                        </div>
                      </div>
                      <div>
                        <div className="text-[#5A5E66]">Simulated Total + Gratitude</div>
                        <div className="font-mono font-semibold text-[#111215]">
                          ${resItem.simulatedPriceUsd + resItem.gratitudeTipUsd} USD
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Direct Concierge & Corporate Incentive Channel */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl border border-black/[0.07] p-6 space-y-4">
                  <h3 className="font-serif-display text-2xl text-[#111215]">
                    Direct Messaging Concierge
                  </h3>
                  <p className="text-xs text-[#5A5E66] leading-relaxed">
                    We communicate directly via your preferred messaging app—WhatsApp, WeChat, or Telegram—for real-time weather adjustments, gate codes, and host introductions.
                  </p>
                  <div className="space-y-2 text-xs text-[#111215]">
                    <div className="p-3 rounded-xl bg-[#F7F7F5] flex items-center justify-between">
                      <span>Kyoto & Kanazawa Desk (WhatsApp / Line)</span>
                      <span className="font-mono text-[#1B4332]">Active</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F7F7F5] flex items-center justify-between">
                      <span>Seoul & Jeju Desk (WeChat / Kakao / Telegram)</span>
                      <span className="font-mono text-[#1B4332]">Active</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#EFECE6] rounded-2xl border border-black/[0.07] p-6 space-y-3">
                  <h3 className="font-serif-display text-2xl text-[#111215]">
                    Corporate Incentives & Private Charters
                  </h3>
                  <p className="text-xs text-[#5A5E66] leading-relaxed">
                    Planning an executive retreat or family reunion in Korea or Japan? Our local partner agencies arrange private temple dining and master artisan workshops for up to 16 guests.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAtelierGroup("Private Group");
                      setActiveTab("atelier");
                    }}
                    className="w-full py-3 min-h-[44px] bg-[#111215] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors"
                  >
                    Configure Private Group Itinerary
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sanctuary Inspection & Reservation Modal / Bottom Sheet */}
      {selectedSanctuary && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedSanctuary(null)}
        >
          <div
            className="bg-[#F7F7F5] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-black/[0.1] p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle for mobile ergonomics */}
            <div className="w-10 h-1.5 bg-stone-300 rounded-full mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-[#1B4332] font-medium">
                  {selectedSanctuary.city}, {selectedSanctuary.country} · {selectedSanctuary.category}
                </div>
                <h2 className="font-serif-display text-2xl sm:text-3xl text-[#111215] mt-1">
                  {selectedSanctuary.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSanctuary(null)}
                aria-label="Close sanctuary dossier"
                className="min-h-[44px] min-w-[44px] rounded-full bg-white border border-black/[0.08] flex items-center justify-center text-[#111215] hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden">
              <ResilientImage
                src={selectedSanctuary.image}
                alt={selectedSanctuary.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-xs text-white px-4 py-2 rounded-xl text-xs flex items-center justify-between tabular-nums">
                <span>{selectedSanctuary.timeWindow}</span>
                <span>Est. ${selectedSanctuary.simulatedPriceUsd} USD / guest (Simulated)</span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#111215]">
              <p className="leading-relaxed text-[#5A5E66]">
                {selectedSanctuary.editorialDetail}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] space-y-1">
                  <div className="text-[#5A5E66]">Host & Custodian</div>
                  <div className="font-semibold text-[#111215]">{selectedSanctuary.hostName}</div>
                  <div className="text-[#5A5E66]">{selectedSanctuary.hostRole}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] space-y-1">
                  <div className="text-[#5A5E66]">Weather & Crowd Assurance</div>
                  <div className="font-semibold text-[#1B4332]">{selectedSanctuary.crowdMetric}</div>
                  <div className="text-[#5A5E66]">{selectedSanctuary.weatherBackupPlan}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-black/[0.06] space-y-1.5 text-xs">
                <div>
                  <strong className="text-[#111215]">Recommended Door-to-Door Transit: </strong>
                  <span className="text-[#5A5E66]">{selectedSanctuary.transportRoute}</span>
                </div>
                <div>
                  <strong className="text-[#111215]">Paired Sanctuary Stay: </strong>
                  <span className="text-[#5A5E66]">{selectedSanctuary.nearestStayRecommendation}</span>
                </div>
              </div>

              {/* Spoken Host Greeting inside Modal */}
              <div className="p-4 rounded-xl bg-[#EFECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="text-[#5A5E66]">Polite Host Greeting ({selectedSanctuary.country === "Japan" ? "Japanese" : "Korean"}):</div>
                  <div className="font-serif-display text-lg text-[#111215]">{selectedSanctuary.localPhrase.native}</div>
                  <div className="text-[#5A5E66] italic">{selectedSanctuary.localPhrase.romaji} — “{selectedSanctuary.localPhrase.english}”</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    playSpokenOutput(
                      selectedSanctuary.localPhrase.native,
                      selectedSanctuary.country === "Japan" ? "Japanese" : "Korean",
                      null
                    )
                  }
                  className="px-3.5 py-2 min-h-[40px] bg-white rounded-xl font-medium text-[#1B4332] flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Speak Greeting</span>
                </button>
              </div>
            </div>

            {/* Reservation & Direct Channel Request Form */}
            <form
              onSubmit={handleConfirmSanctuaryReservation}
              className="bg-white rounded-2xl border border-black/[0.08] p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif-display text-xl text-[#111215]">
                  Request Private Access & Host Dispatch
                </h3>
                <span className="text-[11px] text-[#5A5E66]">Simulated MVP Booking</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="block font-medium text-[#111215]">Preferred Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F7F5] border border-black/[0.1] rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-medium text-[#111215]">Party Type</label>
                  <select
                    value={bookingPartyType}
                    onChange={(e) => setBookingPartyType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F7F5] border border-black/[0.1] rounded-lg"
                  >
                    <option value="Solo">Solo Individual</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Small Group">Small Group</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-medium text-[#111215]">
                    Guests (Max {selectedSanctuary.maxGuests})
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedSanctuary.maxGuests}
                    value={bookingGuests}
                    onChange={(e) => setBookingGuests(Math.max(1, Math.min(selectedSanctuary.maxGuests, Number(e.target.value))))}
                    className="w-full px-3 py-2 bg-[#F7F7F5] border border-black/[0.1] rounded-lg tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="block font-medium text-[#111215]">
                    Preferred Messaging Channel
                  </label>
                  <div className="flex gap-1.5">
                    {(["WhatsApp", "WeChat", "Telegram"] as const).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setBookingChannel(ch)}
                        className={`flex-1 py-2 min-h-[38px] rounded-lg font-medium border transition-colors ${
                          bookingChannel === ch
                            ? "bg-[#111215] text-white border-[#111215]"
                            : "bg-[#F7F7F5] text-[#5A5E66] border-black/[0.08]"
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-medium text-[#111215]">
                    {bookingChannel} Handle or Phone
                  </label>
                  <input
                    type="text"
                    value={bookingHandle}
                    onChange={(e) => setBookingHandle(e.target.value)}
                    placeholder={`Enter your ${bookingChannel} ID or number`}
                    className="w-full px-3 py-2 min-h-[38px] bg-[#F7F7F5] border border-black/[0.1] rounded-lg"
                  />
                </div>
              </div>

              {/* Host Gratitude / Tip Selector */}
              <div className="pt-2 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-medium text-[#111215]">Optional Host & Artisan Gratitude Tip: </span>
                  <span className="text-[#5A5E66]">100% remitted directly to local guild host</span>
                </div>
                <div className="flex items-center gap-1.5 tabular-nums">
                  {[0, 15, 25, 50].map((tip) => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setBookingTipUsd(tip)}
                      className={`px-2.5 py-1.5 min-h-[36px] rounded-lg font-mono border ${
                        bookingTipUsd === tip
                          ? "bg-[#1B4332] text-white border-[#1B4332]"
                          : "bg-[#F7F7F5] text-[#5A5E66] border-black/[0.08]"
                      }`}
                    >
                      ${tip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs tabular-nums">
                  <span className="text-[#5A5E66]">Simulated Total: </span>
                  <strong className="font-mono text-base text-[#111215]">
                    ${selectedSanctuary.simulatedPriceUsd * bookingGuests + bookingTipUsd} USD
                  </strong>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 min-h-[46px] bg-[#1B4332] text-white text-xs font-semibold rounded-xl hover:bg-[#143325] transition-colors"
                >
                  Log Private Access Request
                </button>
              </div>

              {bookingConfirmedBanner && (
                <div className="p-3.5 rounded-xl bg-emerald-950 text-emerald-100 text-xs flex items-center justify-between gap-3">
                  <span>{bookingConfirmedBanner}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSanctuary(null);
                      setActiveTab("passport");
                    }}
                    className="underline font-semibold whitespace-nowrap shrink-0"
                  >
                    View Passport
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-black/[0.07] bg-[#EFECE6]/60 py-8 px-4 sm:px-8 text-xs text-[#5A5E66]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-serif-display text-lg text-[#111215]">Kanso</div>
            <p>
              Private Korea & Japan Sanctuaries · Transparent Notice: Weather forecasts use live Open-Meteo telemetry; partner rates and reservations are simulated for MVP demonstration.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <button type="button" onClick={() => setActiveTab("sanctuaries")} className="hover:text-[#111215]">
              Sanctuaries
            </button>
            <button type="button" onClick={() => setActiveTab("atelier")} className="hover:text-[#111215]">
              Itinerary Atelier
            </button>
            <button type="button" onClick={() => setActiveTab("voice")} className="hover:text-[#111215]">
              Voice Bridge
            </button>
            <button type="button" onClick={() => setActiveTab("passport")} className="hover:text-[#111215]">
              Passport
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Tab Bar (Ergonomic Thumb Zone, <15% Sticky Cap) */}
      <nav
        aria-label="Mobile Primary Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#F7F7F5]/95 backdrop-blur-md border-t border-black/[0.08] grid grid-cols-4 items-center px-2"
      >
        <button
          type="button"
          onClick={() => setActiveTab("sanctuaries")}
          className={`min-h-[48px] flex flex-col items-center justify-center ${
            activeTab === "sanctuaries" ? "text-[#1B4332]" : "text-[#5A5E66]"
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 whitespace-nowrap">Sanctuaries</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("atelier")}
          className={`min-h-[48px] flex flex-col items-center justify-center ${
            activeTab === "atelier" ? "text-[#1B4332]" : "text-[#5A5E66]"
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 whitespace-nowrap">Atelier</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("voice")}
          className={`min-h-[48px] flex flex-col items-center justify-center ${
            activeTab === "voice" ? "text-[#1B4332]" : "text-[#5A5E66]"
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 whitespace-nowrap">Voice Bridge</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("passport")}
          className={`min-h-[48px] flex flex-col items-center justify-center ${
            activeTab === "passport" ? "text-[#1B4332]" : "text-[#5A5E66]"
          }`}
        >
          <BookmarkCheck className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 whitespace-nowrap">
            Passport ({savedReservations.length})
          </span>
        </button>
      </nav>
    </div>
  );
}
