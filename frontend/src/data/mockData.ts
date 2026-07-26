export interface HashtagData {
  id: string;
  hashtag: string;
  spectrumScore: number; // -100 (Extreme Left) to +100 (Extreme Right)
  tweetCount: number;
  trendingRank: number;
  breakdown: {
    policyStance: string;
    keyThemes: string[];
    sentiment: "Positive" | "Negative" | "Neutral" | "Mixed";
    dominantLanguage: string;
  };
  echoChamberDensity: number; // 0 to 1, higher means tighter echo chamber
  topInfluencers: { name: string; handle: string; leaning: number }[];
}

export const mockHashtags: HashtagData[] = [
  {
    id: "1",
    hashtag: "#UnionBudget2024",
    spectrumScore: 45, // Right leaning
    tweetCount: 152000,
    trendingRank: 1,
    breakdown: {
      policyStance: "Pro-business, focused on infrastructure and deregulation. Praise for capital expenditure.",
      keyThemes: ["Economy", "Infrastructure", "Taxation", "Development"],
      sentiment: "Positive",
      dominantLanguage: "English/Hindi (Hinglish)",
    },
    echoChamberDensity: 0.65,
    topInfluencers: [
      { name: "Vikram Singh", handle: "@vikram_eco", leaning: 60 },
      { name: "Priya Sharma", handle: "@priya_finance", leaning: 30 },
    ],
  },
  {
    id: "2",
    hashtag: "#FarmerProtests",
    spectrumScore: -70, // Left leaning
    tweetCount: 89000,
    trendingRank: 2,
    breakdown: {
      policyStance: "Strong opposition to corporate farming laws. Demanding MSP guarantee and welfare protections.",
      keyThemes: ["Agriculture", "Welfare", "Labor Rights", "Protest"],
      sentiment: "Negative",
      dominantLanguage: "Punjabi/Hindi",
    },
    echoChamberDensity: 0.85, // Highly polarized
    topInfluencers: [
      { name: "Kisan Ekta", handle: "@kisan_ekta_morcha", leaning: -80 },
      { name: "Rahul Verma", handle: "@rahul_activist", leaning: -65 },
    ],
  },
  {
    id: "3",
    hashtag: "#DigitalIndia",
    spectrumScore: 10, // Center-Right
    tweetCount: 45000,
    trendingRank: 3,
    breakdown: {
      policyStance: "Support for government digitization initiatives (UPI, Aadhaar) but some privacy concerns raised.",
      keyThemes: ["Technology", "Governance", "Privacy", "Startups"],
      sentiment: "Mixed",
      dominantLanguage: "English",
    },
    echoChamberDensity: 0.30, // Broad discussion across aisles
    topInfluencers: [
      { name: "Tech India News", handle: "@techindia_news", leaning: 5 },
      { name: "Ananya Desai", handle: "@ananya_policy", leaning: 15 },
    ],
  },
  {
    id: "4",
    hashtag: "#FreeSpeechDebate",
    spectrumScore: -30, // Center-Left
    tweetCount: 32000,
    trendingRank: 4,
    breakdown: {
      policyStance: "Criticism of recent internet shutdowns and censorship. Advocacy for civil liberties.",
      keyThemes: ["Democracy", "Censorship", "Rights", "Media"],
      sentiment: "Negative",
      dominantLanguage: "English",
    },
    echoChamberDensity: 0.70,
    topInfluencers: [
      { name: "Civil Libs India", handle: "@civillibs_ind", leaning: -50 },
      { name: "Journalist Collective", handle: "@journocollect", leaning: -25 },
    ],
  }
];
