// ========================================
// Deck Configuration — Dynamic Card Types
// ========================================

export interface CardDef {
    id: number;
    name: string;
    nameKey: string; // i18n key
    meaning: string;
    meaningKey: string;
    advice: string;
    adviceKey: string;
    suit?: string;
    arcana?: "major" | "minor";
    image?: string;
}

export interface DeckConfig {
    id: string;
    nameKey: string; // i18n key for deck name
    totalCards: number;
    cardWidth: number; // px
    cardHeight: number; // px
    fanSpreadAngle: number; // total arc angle in degrees
    description: string;
    descriptionKey: string; // i18n key for description
    backImage?: string; // Optional image URL for the back of the cards
    cards: CardDef[];
}

// ——— Helper to generate card arrays ———

function generateTarotCards(): CardDef[] {
    const majorArcana = [
        "The Fool",
        "The Magician",
        "The High Priestess",
        "The Empress",
        "The Emperor",
        "The Hierophant",
        "The Lovers",
        "The Chariot",
        "Strength",
        "The Hermit",
        "Wheel of Fortune",
        "Justice",
        "The Hanged Man",
        "Death",
        "Temperance",
        "The Devil",
        "The Tower",
        "The Star",
        "The Moon",
        "The Sun",
        "Judgement",
        "The World",
    ];

    const suits = ["Wands", "Cups", "Swords", "Pentacles"];
    const ranks = [
        "Ace",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Page",
        "Knight",
        "Queen",
        "King",
    ];

    const cards: CardDef[] = [];

    majorArcana.forEach((name, i) => {
        cards.push({
            id: i,
            name,
            nameKey: `tarot.major.${i}`,
            meaning: `The essence of ${name.toLowerCase()} guides your path.`,
            meaningKey: `tarot.meaning.major.${i}`,
            advice: `Embrace the energy of ${name.toLowerCase()}.`,
            adviceKey: `tarot.advice.major.${i}`,
            arcana: "major",
        });
    });

    suits.forEach((suit, si) => {
        ranks.forEach((rank, ri) => {
            const id = 22 + si * 14 + ri;
            cards.push({
                id,
                name: `${rank} of ${suit}`,
                nameKey: `tarot.minor.${id}`,
                meaning: `The ${rank.toLowerCase()} of ${suit.toLowerCase()} reveals hidden truths.`,
                meaningKey: `tarot.meaning.minor.${id}`,
                advice: `Channel the power of the ${suit.toLowerCase()}.`,
                adviceKey: `tarot.advice.minor.${id}`,
                suit,
                arcana: "minor",
            });
        });
    });

    return cards;
}

function generateLenormandCards(): CardDef[] {
    const names = [
        "Rider",
        "Clover",
        "Ship",
        "House",
        "Tree",
        "Clouds",
        "Snake",
        "Coffin",
        "Bouquet",
        "Scythe",
        "Whip",
        "Birds",
        "Child",
        "Fox",
        "Bear",
        "Stars",
        "Stork",
        "Dog",
        "Tower",
        "Garden",
        "Mountain",
        "Crossroads",
        "Mice",
        "Heart",
        "Ring",
        "Book",
        "Letter",
        "Gentleman",
        "Lady",
        "Lily",
        "Sun",
        "Moon",
        "Key",
        "Fish",
        "Anchor",
        "Cross",
    ];

    return names.map((name, i) => ({
        id: i,
        name,
        nameKey: `lenormand.${i}`,
        meaning: `${name} symbolizes important changes ahead.`,
        meaningKey: `lenormand.meaning.${i}`,
        advice: `Pay attention to signsposts related to ${name.toLowerCase()}.`,
        adviceKey: `lenormand.advice.${i}`,
    }));
}

function generateOracleCards(): CardDef[] {
    const themes = [
        "Abundance",
        "Adventure",
        "Balance",
        "Blessing",
        "Breakthrough",
        "Calm",
        "Change",
        "Clarity",
        "Compassion",
        "Confidence",
        "Connection",
        "Courage",
        "Creativity",
        "Destiny",
        "Dreams",
        "Empowerment",
        "Faith",
        "Flow",
        "Forgiveness",
        "Freedom",
        "Gratitude",
        "Growth",
        "Guidance",
        "Happiness",
        "Harmony",
        "Healing",
        "Hope",
        "Illumination",
        "Insight",
        "Inspiration",
        "Intuition",
        "Joy",
        "Kindness",
        "Light",
        "Love",
        "Magic",
        "Manifestation",
        "Miracle",
        "Peace",
        "Purpose",
        "Renewal",
        "Serenity",
        "Transformation",
        "Wisdom",
    ];

    return themes.map((name, i) => ({
        id: i,
        name,
        nameKey: `oracle.${i}`,
        meaning: `${name} is the universe's message to you right now.`,
        meaningKey: `oracle.meaning.${i}`,
        advice: `Open yourself to the energy of ${name.toLowerCase()}.`,
        adviceKey: `oracle.advice.${i}`,
    }));
}

function generatePlayingCards(): CardDef[] {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks = [
        "Ace",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "Jack",
        "Queen",
        "King",
    ];
    const cards: CardDef[] = [];

    suits.forEach((suit, si) => {
        ranks.forEach((rank, ri) => {
            const id = si * 13 + ri;
            cards.push({
                id,
                name: `${rank} of ${suit}`,
                nameKey: `playing.${id}`,
                meaning: `The ${rank} of ${suit} brings a message about your path.`,
                meaningKey: `playing.meaning.${id}`,
                advice: `Reflect on the symbol of ${suit.toLowerCase()}.`,
                adviceKey: `playing.advice.${id}`,
                suit,
            });
        });
    });

    return cards;
}

// ——— Deck Definitions ———

export const DECKS: Record<string, DeckConfig> = {
    tarot: {
        id: "tarot",
        nameKey: "deck.tarot",
        totalCards: 78,
        cardWidth: 100,
        cardHeight: 160,
        fanSpreadAngle: 180,
        description: "The classic 78-card Tarot deck with Major and Minor Arcana",
        descriptionKey: "deck.tarotDesc",
        backImage: "/images/back-card.png",
        cards: generateTarotCards(),
    },
    lenormand: {
        id: "lenormand",
        nameKey: "deck.lenormand",
        totalCards: 36,
        cardWidth: 100,
        cardHeight: 150,
        fanSpreadAngle: 150,
        description: "The 36-card Lenormand fortune-telling deck",
        descriptionKey: "deck.lenormandDesc",
        cards: generateLenormandCards(),
    },
    oracle: {
        id: "oracle",
        nameKey: "deck.oracle",
        totalCards: 44,
        cardWidth: 100,
        cardHeight: 150,
        fanSpreadAngle: 160,
        description: "A 44-card Oracle deck for spiritual guidance",
        descriptionKey: "deck.oracleDesc",
        cards: generateOracleCards(),
    },
    playing: {
        id: "playing",
        nameKey: "deck.playing",
        totalCards: 52,
        cardWidth: 90,
        cardHeight: 140,
        fanSpreadAngle: 170,
        description: "A standard 52-card playing deck for cartomancy",
        descriptionKey: "deck.playingDesc",
        cards: generatePlayingCards(),
    },
};

export const READING_TYPES = [
    { id: "love", nameKey: "reading.love", icon: "💕", color: "#e74c8c" },
    {
        id: "career",
        nameKey: "reading.career",
        icon: "💼",
        color: "#34495e",
    },
    { id: "finance", nameKey: "reading.finance", icon: "💰", color: "#f0d77a" },
    { id: "daily", nameKey: "reading.daily", icon: "🌅", color: "#3498db" },
    { id: "health", nameKey: "reading.health", icon: "🌿", color: "#1abc9c" },
    { id: "question", nameKey: "reading.question", icon: "❓", color: "#f39c12", cost: 50 },
] as const;

export type ReadingType = (typeof READING_TYPES)[number]["id"];
export type DeckId = keyof typeof DECKS;

// ——— Spread Options (card count per deck) ———

export interface SpreadOption {
    count: number;
    nameKey: string; // i18n key for the spread description
}

export const SPREAD_OPTIONS: Record<DeckId, SpreadOption[]> = {
    tarot: [
        { count: 1, nameKey: "spread.tarot.1" },
        { count: 3, nameKey: "spread.tarot.3" },
        { count: 10, nameKey: "spread.tarot.10" },
    ],
    lenormand: [
        { count: 3, nameKey: "spread.lenormand.3" },
        { count: 5, nameKey: "spread.lenormand.5" },
        { count: 9, nameKey: "spread.lenormand.9" },
    ],
    oracle: [
        { count: 1, nameKey: "spread.oracle.1" },
        { count: 3, nameKey: "spread.oracle.3" },
    ],
    playing: [
        { count: 1, nameKey: "spread.playing.1" },
        { count: 3, nameKey: "spread.playing.3" },
        { count: 5, nameKey: "spread.playing.5" },
    ],
};
