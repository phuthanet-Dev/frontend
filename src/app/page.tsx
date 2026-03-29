"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NextIntlClientProvider, useTranslations, useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import DeckSelector from "@/components/DeckSelector";
import CardFan from "@/components/CardFan";
import ReadingResult from "@/components/ReadingResult";
import AuthModal from "@/components/AuthModal";
import AdInterstitial from "@/components/AdInterstitial";
import ProfileModal from "@/components/ProfileModal";
import VipModal from "@/components/VipModal";
import CoinTopUpModal from "@/components/CoinTopUpModal";
import { DECKS, type ReadingType, type DeckId, type CardDef, type SpreadOption } from "@/lib/deckConfig";
import { useFreemium } from "@/lib/useFreemium";
import { useAuth } from "@/context/AuthContext";

type AppPhase = "select" | "reading" | "result";

// ——— Inner component that uses useTranslations() ———
// This MUST be a child of the provider so it re-reads translations on locale change.
function TarotAppInner({
    locale,
    onLocaleChange,
}: {
    locale: string;
    onLocaleChange: (locale: string) => void;
}) {
    const t = useTranslations();
    const [phase, setPhase] = useState<AppPhase>("select");
    const [selectedReading, setSelectedReading] = useState<ReadingType | null>(null);
    const [selectedDeck, setSelectedDeck] = useState<DeckId | null>(null);
    const [selectedSpread, setSelectedSpread] = useState<SpreadOption | null>(null);
    const [selectedCards, setSelectedCards] = useState<CardDef[]>([]);
    const [userQuestion, setUserQuestion] = useState("");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [isVipModalOpen, setIsVipModalOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [isDeducting, setIsDeducting] = useState(false);

    const { canRead, readingsLeft, consumeReading, unlockByAd } = useFreemium();
    const { user, fetchCoinBalance, needsProfile, completeProfile } = useAuth();

    const handleStartReading = useCallback(async (question?: string) => {
        if (question) {
            setUserQuestion(question);
        }

        // Handle Coin Deduction for Question Reading
        if (selectedReading === "question") {
            if (!user) {
                setIsAuthModalOpen(true);
                return;
            }

            try {
                setIsDeducting(true);
                const token = await user.getIdToken();
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                const res = await fetch(`${apiUrl}/api/coins/deduct`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ amount: 50, readingType: "question" })
                });

                if (!res.ok) {
                    // Open topup modal or show error.
                    // For now, we rely on DeckSelector to prevent clicking if balance < 50
                    console.error("Failed to deduct coins");
                    setIsDeducting(false);
                    return;
                }

                await fetchCoinBalance();
            } catch (err) {
                console.error("Coin deduction error", err);
                setIsDeducting(false);
                return;
            } finally {
                setIsDeducting(false);
            }
        } else {
            // Standard Freemium Logic for other readings
            if (!canRead) {
                setIsAdModalOpen(true);
                return;
            }
            consumeReading();
        }

        setPhase("reading");
        setSelectedCards([]);
    }, [canRead, consumeReading, selectedReading, user, fetchCoinBalance]);

    const handleAdComplete = useCallback(() => {
        unlockByAd();
        consumeReading();
        setPhase("reading");
        setSelectedCards([]);
    }, [unlockByAd, consumeReading]);

    const handleCardsSelected = useCallback((cards: CardDef[]) => {
        setSelectedCards(cards);
        setTimeout(() => setPhase("result"), 500);
    }, []);

    const handleSelectDeck = useCallback((deck: DeckId) => {
        setSelectedDeck(deck);
        setSelectedSpread(null); // reset spread when deck changes
    }, []);

    const handleNewReading = useCallback(() => {
        setPhase("select");
        setSelectedReading(null);
        setSelectedDeck(null);
        setSelectedSpread(null);
        setSelectedCards([]);
    }, []);

    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar
                currentLocale={locale}
                onLocaleChange={onLocaleChange}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />

            <main className="flex-1 flex flex-col items-center justify-center py-8">
                <AnimatePresence mode="wait">
                    {/* Phase 1: Deck & Reading Type Selection */}
                    {phase === "select" && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            {/* Hero Section */}
                            <div className="text-center mb-8 px-4">
                                <motion.h1
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent leading-[2] overflow-visible"
                                >
                                    {t("app.title")}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-mystic-200/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
                                >
                                    {t("app.description")}
                                </motion.p>
                            </div>

                            <DeckSelector
                                selectedReading={selectedReading}
                                selectedDeck={selectedDeck}
                                selectedSpread={selectedSpread}
                                onSelectReading={setSelectedReading}
                                onSelectDeck={handleSelectDeck}
                                onSelectSpread={setSelectedSpread}
                                onStartReading={handleStartReading}
                            />
                        </motion.div>
                    )}

                    {/* Phase 2: Interactive Card Fan */}
                    {phase === "reading" && selectedDeck && (
                        <motion.div
                            key="reading"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.6 }}
                            className="w-full flex flex-col items-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-6"
                            >
                                <h2 className="text-2xl md:text-3xl font-bold glow-text">
                                    {t("cards.selectCard")}
                                </h2>
                                <p className="text-mystic-300/60 text-sm mt-2">
                                    {t(DECKS[selectedDeck].nameKey)} •{" "}
                                    {selectedReading && t(`reading.${selectedReading}`)}
                                </p>
                            </motion.div>

                            <CardFan
                                deck={DECKS[selectedDeck]}
                                maxSelections={selectedSpread?.count || 1}
                                onCardsSelected={handleCardsSelected}
                            />

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                onClick={() => setPhase("select")}
                                className="mt-6 text-mystic-300/50 hover:text-gold-300 text-sm transition-colors cursor-pointer"
                            >
                                ← Change Deck
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Phase 3: Result */}
                    {phase === "result" && selectedCards.length > 0 && selectedReading && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            <ReadingResult
                                cards={selectedCards}
                                readingType={selectedReading}
                                readingsLeft={readingsLeft}
                                userQuestion={userQuestion}
                                onNewReading={handleNewReading}
                                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* SEO Informative Content for AdSense (Thin Content Prevention) */}
            {phase === "select" && (
                <section className="max-w-4xl mx-auto px-4 py-12 text-center text-mystic-300/70">
                    <h2 className="text-2xl font-semibold mb-4 text-mystic-200">{t("seo.title")}</h2>
                    <p className="text-sm leading-relaxed max-w-2xl mx-auto">
                        {t("seo.description")}
                    </p>
                </section>
            )}

            {/* Footer */}
            <footer className="py-6 text-center border-t border-mystic-600/30 mt-auto">
                <p className="text-mystic-300/40 text-xs mb-3 max-w-2xl mx-auto px-4">{t("footer.disclaimer")}</p>
                <div className="flex justify-center flex-wrap gap-4 mt-2">
                    <a href="/privacy-policy" className="text-mystic-300/40 hover:text-mystic-300 transition-colors text-xs">{t("footer.privacyPolicy") || "Privacy Policy"}</a>
                    <p className="text-mystic-300/40 text-xs">{t("footer.copyright")}</p>
                    <a href="/terms-of-use" className="text-mystic-300/40 hover:text-mystic-300 transition-colors text-xs">{t("footer.termsOfUse") || "Terms of Use"}</a>
                </div>
            </footer>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <ProfileModal
                isOpen={needsProfile}
                onClose={() => {}} // User must complete it
                onSubmit={completeProfile}
            />

            <AdInterstitial
                isOpen={isAdModalOpen}
                onClose={() => setIsAdModalOpen(false)}
                onAdComplete={handleAdComplete}
                onOpenVip={() => {
                    setIsAdModalOpen(false);
                    setIsVipModalOpen(true);
                }}
            />

            <VipModal
                isOpen={isVipModalOpen}
                onClose={() => setIsVipModalOpen(false)}
                onOpenTopUp={() => {
                    setIsVipModalOpen(false);
                    setIsTopUpModalOpen(true);
                }}
            />

            <CoinTopUpModal
                isOpen={isTopUpModalOpen}
                onClose={() => setIsTopUpModalOpen(false)}
            />
        </div>
    );
}

// ——— Outer wrapper that manages locale & provider ———
function TarotAppContent() {
    const serverLocale = useLocale();
    const [locale, setLocale] = useState(serverLocale); // Initialize default, then sync in useEffect to avoid hydration mismatch if standard Next.js cookie hydration isn't working perfectly due to static export
    const [messages, setMessages] = useState<Record<string, any> | null>(null);

    // Initial load sync with cookie
    useEffect(() => {
        const match = document.cookie.match(new RegExp('(^| )MYSTIC_LOCALE=([^;]+)'));
        const savedLocale = match ? match[2] : "th";
        if (savedLocale !== "th") {
            setLocale(savedLocale);
            import(`../../messages/${savedLocale}.json`).then(msgs => setMessages(msgs.default));
        }
    }, []);

    const handleLocaleChange = useCallback(async (newLocale: string) => {
        try {
            const msgs = await import(`../../messages/${newLocale}.json`);
            setMessages(msgs.default);
            setLocale(newLocale);
            document.cookie = `MYSTIC_LOCALE=${newLocale}; path=/; max-age=31536000`;
        } catch (e) {
            console.error("Failed to load locale:", newLocale, e);
        }
    }, []);

    // When locale changes, wrap with a fresh provider so TarotAppInner re-reads translations
    if (messages) {
        return (
            <NextIntlClientProvider locale={locale} messages={messages}>
                <TarotAppInner locale={locale} onLocaleChange={handleLocaleChange} />
            </NextIntlClientProvider>
        );
    }

    // Default: use the server-provided messages from layout.tsx
    return <TarotAppInner locale={locale} onLocaleChange={handleLocaleChange} />;
}

export default function Home() {
    return <TarotAppContent />;
}
