import heroKyotoImg from "../assets/images/hero_kyoto_twilight_1791444946759.jpg";
import seoulHanokImg from "../assets/images/seoul_hanok_private_tea_1791444961493.jpg";
import kanazawaCraftImg from "../assets/images/kanazawa_craft_atelier_1791444977305.jpg";
import jejuTrailImg from "../assets/images/jeju_volcanic_coast_trail_1791444989742.jpg";
import naoshimaStayImg from "../assets/images/naoshima_art_sanctuary_1791445002702.jpg";

export interface SanctuaryItem {
  id: string;
  title: string;
  city: "Kyoto" | "Tokyo" | "Kanazawa" | "Naoshima" | "Seoul" | "Jeju" | "Gyeongju";
  country: "Japan" | "South Korea";
  neighborhood: string;
  category: "After-Hours Access" | "Local Hobby Guild" | "Private Guide" | "Architectural Stay";
  timeWindow: string;
  crowdMetric: string;
  weatherSuitability: "All-Weather" | "Indoor Sanctuary" | "Clear Sky Best";
  weatherBackupPlan: string;
  hostName: string;
  hostRole: string;
  hostAvatarInitials: string;
  simulatedPriceUsd: number;
  maxGuests: number;
  image: string;
  summary: string;
  editorialDetail: string;
  transportRoute: string;
  nearestStayRecommendation: string;
  localPhrase: {
    native: string;
    romaji: string;
    english: string;
  };
  verifiedReviews: Array<{
    traveler: string;
    origin: string;
    partyType: string;
    comment: string;
    date: string;
  }>;
}

export const HERO_ASSET = heroKyotoImg;

export const CURATED_SANCTUARIES: SanctuaryItem[] = [
  {
    id: "kyoto-daitokuji-twilight",
    title: "Daitoku-ji Sub-Temple Private Lantern Viewing",
    city: "Kyoto",
    country: "Japan",
    neighborhood: "Kita Ward · Murasakino",
    category: "After-Hours Access",
    timeWindow: "18:00 – 20:00 (After Public Closing)",
    crowdMetric: "Private entry · Max 6 guests (vs. 1,400+ daytime visitors)",
    weatherSuitability: "All-Weather",
    weatherBackupPlan: "Covered hinoki engawa walkways and indoor tatami contemplation hall.",
    hostName: "Rev. Kenji Takahashi",
    hostRole: "Associate Abbot & Classical Garden Historian",
    hostAvatarInitials: "KT",
    simulatedPriceUsd: 165,
    maxGuests: 6,
    image: heroKyotoImg,
    summary:
      "Step behind closed cedar gates after day crowds depart for an unhurried evening of dry-landscape stone contemplation and Uji matcha.",
    editorialDetail:
      "Arranged directly with our partner sub-temple custodian, guests enter 60 minutes after public gates lock. Walk the moss and raked gravel gardens in complete silence by hand-lit paper lanterns, followed by whisked ceremonial tea inside a 16th-century shoin study.",
    transportRoute: "14 min via Private Electric Cedar Taxi from Karasuma Oike (¥2,400 est.) or Subway Karasuma Line to Kitaoji Station + 8 min walk.",
    nearestStayRecommendation: "Murasakino Machiya Residence (6 min walk · Est. $310/night)",
    localPhrase: {
      native: "静かなお時間をありがとうございます。",
      romaji: "Shizuka na ojikan wo arigatou gozaimasu.",
      english: "Thank you for sharing this quiet moment with us.",
    },
    verifiedReviews: [
      {
        traveler: "Eleanor & Marcus V.",
        origin: "Zurich",
        partyType: "Couple",
        comment:
          "Having an entire Muromachi-era garden to ourselves at dusk while rain tapped on the cedar eaves was the highlight of our ten days in Japan.",
        date: "September 2026",
      },
    ],
  },
  {
    id: "seoul-bukchon-tea-guild",
    title: "Bukchon Heritage Hanok Celadon & Wild Tea Circle",
    city: "Seoul",
    country: "South Korea",
    neighborhood: "Jongno-gu · Gahoe-dong",
    category: "Local Hobby Guild",
    timeWindow: "19:00 – 21:00 (Evening Guild Gathering)",
    crowdMetric: "Intimate 5-seat courtyard (Zero street crowd noise)",
    weatherSuitability: "Indoor Sanctuary",
    weatherBackupPlan: "Heated ondol pine floor pavilion with panoramic courtyard eaves.",
    hostName: "Jiyeon Seo",
    hostRole: "Founder, Seoul Wild Tea & Ceramic Collectors Circle",
    hostAvatarInitials: "JS",
    simulatedPriceUsd: 120,
    maxGuests: 5,
    image: seoulHanokImg,
    summary:
      "Join a local Seoulite tea and ceramic collectors' hobby circle inside a private 1920s courtyard Hanok closed to walk-in tourists.",
    editorialDetail:
      "While daytime Bukchon alleys fill with tour groups, evening restores the neighborhood to quiet residential life. Sit on warm ondol floors with local collectors tasting wild-harvested Hadong green teas from master-fired Icheon celadon vessels.",
    transportRoute: "9 min walk from Anguk Station Exit 2 (Line 3) via quiet upper ridge lane, or 12 min Kakao T Black sedan from Gwanghwamun.",
    nearestStayRecommendation: "Rakkojae Courtyard Suite Seoul (4 min walk · Est. $340/night)",
    localPhrase: {
      native: "차 향기가 정말 깊고 따뜻하네요.",
      romaji: "Cha hyanggiga jeongmal gipgo ttatteuthaneyo.",
      english: "The aroma of this tea is truly deep and comforting.",
    },
    verifiedReviews: [
      {
        traveler: "David L. & Family",
        origin: "Singapore",
        partyType: "Family of 4",
        comment:
          "Jiyeon and her fellow tea enthusiasts welcomed our two teenagers so warmly. It felt like visiting cultured old friends rather than taking a tour.",
        date: "October 2026",
      },
    ],
  },
  {
    id: "kanazawa-gold-leaf-atelier",
    title: "Higashi Chaya 4th-Generation Urushi & Gold Leaf Guild",
    city: "Kanazawa",
    country: "Japan",
    neighborhood: "Higashiyama · Utatsuyama Foot",
    category: "Local Hobby Guild",
    timeWindow: "16:30 – 18:30 (Late Afternoon Studio Session)",
    crowdMetric: "Private working studio · Max 4 participants",
    weatherSuitability: "Indoor Sanctuary",
    weatherBackupPlan: "100% climate-controlled historic kura storehouse workshop.",
    hostName: "Master Takumi Maeda",
    hostRole: "4th-Generation Kanazawa Haku & Urushi Artisan",
    hostAvatarInitials: "TM",
    simulatedPriceUsd: 145,
    maxGuests: 4,
    image: kanazawaCraftImg,
    summary:
      "Work alongside Kanazawa lacquerware practitioners inside a humidity-sealed earthen kura studio away from commercial souvenir shops.",
    editorialDetail:
      "Kanazawa produces 99% of Japan's Entsuji gold leaf. Instead of a crowded 20-person tourist sticker class, spend two quiet hours with Master Maeda and local apprentice hobbyists learning bamboo-tweezer leaf placement on genuine拭き漆 (fuki-urushi) cedar vessels.",
    transportRoute: "11 min via Hokutetsu Bus from Kanazawa Station East Gate to Hashibacho, followed by a 5 min stroll along the Asano River.",
    nearestStayRecommendation: "Kumu Kanazawa or Saiokuken Townhouse (7 min taxi · Est. $245/night)",
    localPhrase: {
      native: "手仕事の美しさに感動しました。",
      romaji: "Teshigoto no utsukushisa ni kandou shimashita.",
      english: "I am deeply moved by the beauty of your craftsmanship.",
    },
    verifiedReviews: [
      {
        traveler: "Clara M.",
        origin: "London",
        partyType: "Solo Traveler",
        comment:
          "When Hokuriku rain rolled in at 4 PM, this warm wooden atelier was the most peaceful refuge imaginable.",
        date: "August 2026",
      },
    ],
  },
  {
    id: "jeju-basalt-coastal-geology",
    title: "Dawn Basalt Sea Cliffs & Haenyeo Hearth Walk",
    city: "Jeju",
    country: "South Korea",
    neighborhood: "Seogwipo · Pyoseon & Aewol Coast",
    category: "Private Guide",
    timeWindow: "06:30 – 09:30 (First Light Coastal Window)",
    crowdMetric: "Unmarked coastal path · 0 tour buses",
    weatherSuitability: "Clear Sky Best",
    weatherBackupPlan: "Shifts to Bonte Museum architectural study & volcanic stone tea roastery in high wind.",
    hostName: "Dr. Hyun-woo Kang",
    hostRole: "Marine Ecologist & Jeju Trail Conservationist",
    hostAvatarInitials: "HK",
    simulatedPriceUsd: 135,
    maxGuests: 6,
    image: jejuTrailImg,
    summary:
      "Traverse quiet volcanic hexagonal basalt headlands at sunrise with a local ecologist, concluding with warm abalone porridge by a stone hearth.",
    editorialDetail:
      "Bypass commercial observation decks and walk a conservationist-curated segment of coastal silver grass and lava tidepools. Learn how Jeju's UNESCO volcanic stone windbreaks (batdam) shape island life before sharing breakfast prepared with sustainably harvested sea greens.",
    transportRoute: "Private EV SUV pickup included from Seogwipo or Jeju City accommodations (35 min coastal drive).",
    nearestStayRecommendation: "Podo Hotel by Itami Jun or Blind Whale Stone House (Est. $290/night)",
    localPhrase: {
      native: "제주의 바람과 바다가 참 평화롭습니다.",
      romaji: "Jejaui baramgwa badaga cham pyeonghwaropseumnida.",
      english: "The wind and sea of Jeju are truly peaceful.",
    },
    verifiedReviews: [
      {
        traveler: "Hannah & Julian R.",
        origin: "Melbourne",
        partyType: "Couple",
        comment:
          "We didn't see another tourist for two hours—just basalt cliffs, diving birds, and Dr. Kang's extraordinary stories.",
        date: "September 2026",
      },
    ],
  },
  {
    id: "naoshima-inland-sea-sanctuary",
    title: "Seto Inland Sea Architectural Sanctuary & Twilight Ferry Route",
    city: "Naoshima",
    country: "Japan",
    neighborhood: "Honmura & Miyanoura Port",
    category: "Architectural Stay",
    timeWindow: "15:00 Check-In · After-Daytripper Island Quiet",
    crowdMetric: "Island population drops 80% after the 17:00 ferry departs",
    weatherSuitability: "All-Weather",
    weatherBackupPlan: "Subterranean concrete galleries and private cedar bathhouse overlooking the sea.",
    hostName: "Aiko Morimoto",
    hostRole: "Architectural Curator & Setouchi Island Host",
    hostAvatarInitials: "AM",
    simulatedPriceUsd: 380,
    maxGuests: 4,
    image: naoshimaStayImg,
    summary:
      "Experience Naoshima after day-trippers leave on the last afternoon ferry, pairing a private cedar suite with a curated twilight walk through Honmura.",
    editorialDetail:
      "Most visitors rush through Naoshima between 10 AM and 4 PM. By staying overnight in a 4-suite cedar and architectural concrete sanctuary, you experience Honmura's Art House district in golden-hour stillness, with private chartered water-taxi transfers to Teshima and Uno Port.",
    transportRoute: "Shinkansen to Okayama → JR Uno Line to Uno Port → 15 min private charter launch or ferry to Naoshima.",
    nearestStayRecommendation: "Included: Seto Cedar Sanctuary Suite (Est. $380/night)",
    localPhrase: {
      native: "瀬戸内の夕凪がとても美しいですね。",
      romaji: "Setouchi no yuunagi ga totemo utsukushii desu ne.",
      english: "The evening calm of the Seto Inland Sea is remarkably beautiful.",
    },
    verifiedReviews: [
      {
        traveler: "Soren K.",
        origin: "Copenhagen",
        partyType: "Solo Architect",
        comment:
          "Staying on the island after 5 PM completely transforms Naoshima. The private water taxi logistics were effortless.",
        date: "October 2026",
      },
    ],
  },
];

export interface TransportComparison {
  id: string;
  corridor: string;
  country: "Japan" | "South Korea";
  recommendedOption: {
    mode: string;
    duration: string;
    estimatedCostUsd: number;
    crowdAdvantage: string;
    routeSteps: string[];
  };
  alternativeBudgetOption: {
    mode: string;
    duration: string;
    estimatedCostUsd: number;
    note: string;
  };
}

export const TRANSPORT_CORRIDORS: TransportComparison[] = [
  {
    id: "tokyo-kyoto-green",
    corridor: "Tokyo → Kyoto (Kansai Sanctuary Route)",
    country: "Japan",
    recommendedOption: {
      mode: "Nozomi Shinkansen Green Car (Car 8/9 Quiet Zone) + Private Station Porter",
      duration: "2h 13m",
      estimatedCostUsd: 138,
      crowdAdvantage: "Bypasses main concourse luggage queues via SmartEX IC direct boarding & reserved oversized bag seat.",
      routeSteps: [
        "Board at Shinagawa Station (40% quieter transfer than Tokyo Station)",
        "2h 06m Nozomi Green Car to Kyoto Station Hachijo East Exit",
        "Pre-arranged MK Cedar EV sedan direct to Kita-ku machiya stay",
      ],
    },
    alternativeBudgetOption: {
      mode: "Low-Cost Domestic Flight (Skyscanner Benchmark: NRT/HND → KIX) + Haruka Express",
      duration: "3h 45m door-to-door",
      estimatedCostUsd: 74,
      note: "Lower base fare, though rail remains faster and avoids airport security queues.",
    },
  },
  {
    id: "seoul-gyeongju-jeju",
    corridor: "Seoul → Gyeongju → Jeju Island",
    country: "South Korea",
    recommendedOption: {
      mode: "KTX-Sancheon First Class to Gyeongju + Gimhae/Pohang Regional Flight to Jeju",
      duration: "2h 08m rail + 55m flight",
      estimatedCostUsd: 112,
      crowdAdvantage: "Avoids congested Gimpo morning departure halls by routing south through Silla heritage valleys first.",
      routeSteps: [
        "Seoul Station KTX First Class Car 3 to Gyeongju Station",
        "Private afternoon architectural tour of Yangdong Village after tour buses depart",
        "Short regional hop to Jeju Airport with coastal EV pickup",
      ],
    },
    alternativeBudgetOption: {
      mode: "Direct Low-Cost Carrier (GMP → CJU Economy)",
      duration: "1h 15m flight (+90m terminal buffer)",
      estimatedCostUsd: 52,
      note: "Ideal for short 2-day Jeju extensions when skipping Gyeongju.",
    },
  },
];

export const ESSENTIAL_PHRASES = [
  {
    id: "jp-after-hours",
    language: "Japanese" as const,
    category: "Sanctuary Greeting",
    english: "Thank you for welcoming us after hours into this quiet space.",
    native: "閉門後の静かなお時間にお招きいただき、ありがとうございます。",
    romaji: "Heimon-go no shizuka na ojikan ni omaneki itadaki, arigatou gozaimasu.",
    etiquette: "Bow slightly (15 degrees) with hands together at your waist before stepping onto the tatami threshold.",
  },
  {
    id: "jp-dietary",
    language: "Japanese" as const,
    category: "Culinary & Tea",
    english: "Everything is prepared with extraordinary care. May I ask about the seasonal ingredients?",
    native: "とても丁寧なお仕立てですね。旬の食材について教えていただけますか？",
    romaji: "Totemo teinei na oshitate desu ne. Shun no shokuzai ni tsuite oshiete itadakemasu ka?",
    etiquette: "Master chefs and tea hosts deeply appreciate curiosity about seasonal provenance (shun).",
  },
  {
    id: "kr-guild",
    language: "Korean" as const,
    category: "Hobby Guild Encounter",
    english: "It is an honor to learn alongside your local craft circle this evening.",
    native: "오늘 저녁 지역의 멋진 모임에 함께하게 되어 영광입니다.",
    romaji: "Oneul jeonyeok jiyeogui meotjin moime hamkkehage doeeo yeonggwangimnida.",
    etiquette: "Receive shared tea cups or craft tools with both hands as a gesture of mutual respect.",
  },
  {
    id: "kr-transport",
    language: "Korean" as const,
    category: "Quiet Transit",
    english: "Could you please drop us off at the quiet side lane near the Hanok courtyard?",
    native: "한옥 안뜰 근처의 조용한 골목 입구에 내려주실 수 있을까요?",
    romaji: "Hanok antteul geuncheoui joyonghan golmok ipgu-e naeryeojusil su isseulkkayo?",
    etiquette: "Narrow Bukchon and Gyeongju lanes are pedestrian-priority; alighting at the lane entrance respects neighbors.",
  },
];
