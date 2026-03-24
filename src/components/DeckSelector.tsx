"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { READING_TYPES, DECKS, SPREAD_OPTIONS, type ReadingType, type DeckId, type SpreadOption } from "@/lib/deckConfig";
import { useAuth } from "@/context/AuthContext";

interface DeckSelectorProps {
    selectedReading: ReadingType | null;
    selectedDeck: DeckId | null;
    selectedSpread: SpreadOption | null;
    onSelectReading: (type: ReadingType) => void;
    onSelectDeck: (deck: DeckId) => void;
    onSelectSpread: (spread: SpreadOption) => void;
    onStartReading: (question?: string) => void;
}

export default function DeckSelector({
    selectedReading,
    selectedDeck,
    selectedSpread,
    onSelectReading,
    onSelectDeck,
    onSelectSpread,
    onStartReading,
}: DeckSelectorProps) {
    const t = useTranslations();
    const { coinBalance } = useAuth();
    const [questionText, setQuestionText] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    const isQuestionReading = selectedReading === "question";
    const questionCost = READING_TYPES.find(r => r.id === "question")?.cost || 50;
    const hasEnoughCoins = coinBalance >= questionCost;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto px-4 py-8"
        >
            {/* Step Indicator */}
            <div className="text-sm font-semibold text-mystic-300 tracking-widest uppercase mb-8 text-center flex items-center justify-center gap-4">
                <span className={currentStep >= 1 ? "text-gold-400" : "text-mystic-500"}>1. {t("nav.stepDeck")}</span>
                <span className="text-mystic-600">→</span>
                <span className={currentStep >= 2 ? "text-gold-400" : "text-mystic-500"}>2. {t("nav.stepSpread")}</span>
                <span className="text-mystic-600">→</span>
                <span className={currentStep >= 3 ? "text-gold-400" : "text-mystic-500"}>3. {t("nav.stepType")}</span>
            </div>

            {/* Deck Selection - Step 1 */}
            {currentStep === 1 && (
                <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 glow-text">
                        {t("deck.selectDeck")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {Object.entries(DECKS).map(([id, deck], index) => (
                            <motion.button
                                key={id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.12, duration: 0.5 }}
                                whileHover={{ scale: 1.03, y: -3 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => onSelectDeck(id as DeckId)}
                                className={`glass rounded-2xl p-6 text-left cursor-pointer transition-all duration-300 ${selectedDeck === id
                                    ? "ring-2 ring-gold-400 glow-gold"
                                    : "hover:border-gold-500/30"
                                    }`}
                            >
                                {/* Decorative card stack icon */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="relative w-10 h-14">
                                        <div className="absolute inset-0 rounded-md card-back rotate-[-6deg] scale-[0.85]" />
                                        <div className="absolute inset-0 rounded-md card-back rotate-[-3deg] scale-[0.92]" />
                                        <div className="absolute inset-0 rounded-md card-back" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gold-300 text-lg">
                                            {t(deck.nameKey)}
                                        </div>
                                        <div className="text-xs text-mystic-300">
                                            {deck.totalCards} {t("deck.cardsInDeck")}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-mystic-200/70 leading-relaxed">
                                    {t(deck.descriptionKey)}
                                </p>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Spread / Card Count Selection - Step 2 */}
            {currentStep === 2 && selectedDeck && (
                <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 glow-text">
                        {t("spread.selectSpread")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        {SPREAD_OPTIONS[selectedDeck].map((spread, index) => (
                            <motion.button
                                key={spread.count}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                whileHover={{ scale: 1.04, y: -3 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => onSelectSpread(spread)}
                                className={`glass rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 ${selectedSpread?.count === spread.count
                                    ? "ring-2 ring-gold-400 glow-gold"
                                    : "hover:border-gold-500/30"
                                    }`}
                            >
                                <div className="text-3xl font-black bg-gradient-to-br from-gold-300 to-gold-500 bg-clip-text text-transparent mb-2">
                                    {spread.count}
                                </div>
                                <div className="text-xs text-mystic-300 mb-1">
                                    {spread.count} {t("spread.cards")}
                                </div>
                                <div className="text-sm font-medium text-mystic-100 leading-snug">
                                    {t(spread.nameKey)}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Reading Type Selection - Step 3 */}
            {currentStep === 3 && selectedDeck && selectedSpread && (
                <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 glow-text">
                        {t("reading.selectType")}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {READING_TYPES.map((type, index) => (
                            <motion.button
                                key={type.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelectReading(type.id)}
                                className={`glass rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 ${selectedReading === type.id
                                    ? "ring-2 ring-gold-400 glow-gold"
                                    : "hover:border-gold-500/30"
                                    }`}
                            >
                                <div className="text-3xl mb-3">{type.icon}</div>
                                <div className="text-sm font-semibold text-mystic-100">
                                    {t(type.nameKey)}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Question Input (shows if Question Reading type is selected inside Step 3) */}
            {currentStep === 3 && selectedReading === "question" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 max-w-3xl mx-auto"
                >
                    <div className="glass rounded-2xl p-6 md:p-8">
                        <h3 className="text-xl md:text-2xl font-bold text-center mb-4 text-gold-300">
                            {t("reading.questionPrompt")}
                        </h3>
                        <p className="text-center text-sm text-mystic-300/80 mb-6 flex justify-center items-center gap-2">
                            <span className="text-gold-400">💰</span>
                            {t("coin.cost", { amount: 50 })}
                        </p>
                        <textarea
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder={t("reading.questionPlaceholder")}
                            className="w-full h-32 bg-space-900/50 border border-mystic-500/30 rounded-xl p-4 text-mystic-100 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 resize-none transition-all placeholder:text-mystic-500"
                        />
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {[
                                t("reading.exLove"),
                                t("reading.exCareer"),
                                t("reading.exFinance"),
                                t("reading.exDaily"),
                                t("reading.exHealth")
                            ].map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => setQuestionText(q)}
                                    className="text-xs bg-mystic-800/50 hover:bg-mystic-700 text-mystic-200 py-1.5 px-3 rounded-full border border-mystic-600/30 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 bg-mystic-900/30 p-4 rounded-full border border-mystic-500/20 max-w-4xl mx-auto">
                {currentStep > 1 ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="px-6 py-3 rounded-full font-semibold flex items-center gap-2 bg-mystic-800 text-mystic-100 hover:bg-mystic-700 border border-mystic-500/50 hover:border-gold-500/50 transition-all"
                    >
                        <span>←</span> {t("nav.previous")}
                    </motion.button>
                ) : (
                    <div></div> // Empty div for flex space-between alignment
                )}

                {currentStep < 3 ? (
                    <motion.button
                        whileHover={{ scale: (currentStep === 1 && selectedDeck) || (currentStep === 2 && selectedSpread) ? 1.05 : 1 }}
                        whileTap={{ scale: (currentStep === 1 && selectedDeck) || (currentStep === 2 && selectedSpread) ? 0.95 : 1 }}
                        disabled={(currentStep === 1 && !selectedDeck) || (currentStep === 2 && !selectedSpread)}
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        className={`px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all ${(currentStep === 1 && !selectedDeck) || (currentStep === 2 && !selectedSpread)
                            ? "opacity-40 cursor-not-allowed bg-mystic-800 text-mystic-500 border border-mystic-700"
                            : "bg-mystic-800 text-mystic-100 hover:bg-gold-400 hover:text-mystic-900 hover:border-gold-300 hover:shadow-[0_0_20px_rgba(212,168,73,0.4),0_0_40px_rgba(212,168,73,0.2),0_0_60px_rgba(212,168,73,0.1)] border border-mystic-500/50 hover:border-gold-300 active:bg-gold-400 active:text-mystic-900 active:border-gold-300 active:shadow-[0_0_20px_rgba(212,168,73,0.4),0_0_40px_rgba(212,168,73,0.2),0_0_60px_rgba(212,168,73,0.1)]"
                            }`}
                    >
                        {t("nav.next")} <span>→</span>
                    </motion.button>
                ) : (
                    // Start Reading Button (Step 3)
                    <div className="flex gap-4">
                        {isQuestionReading && !hasEnoughCoins ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onStartReading(questionText)}
                                className="btn-mystic px-8 py-3 text-lg tracking-wide bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-500/50 text-red-200"
                            >
                                {t("coin.notEnough")} - 💰50
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: selectedReading && (!isQuestionReading || questionText.trim().length > 0) ? 1.05 : 1 }}
                                whileTap={{ scale: selectedReading && (!isQuestionReading || questionText.trim().length > 0) ? 0.95 : 1 }}
                                disabled={!selectedReading || (isQuestionReading && questionText.trim().length === 0)}
                                onClick={() => onStartReading(questionText)}
                                className={`btn-mystic px-8 py-3 text-lg tracking-wide ${(!selectedReading || (isQuestionReading && questionText.trim().length === 0)) ? 'opacity-50 cursor-not-allowed bg-mystic-800 border-mystic-600 text-mystic-400 glow-none' : 'glow-gold'}`}
                            >
                                🔮 {t("spread.beginReading")}
                            </motion.button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
