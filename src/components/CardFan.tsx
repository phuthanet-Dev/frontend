"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import ShuffleButton from "./ShuffleButton";
import CutButton from "./CutButton";
import type { DeckConfig, CardDef } from "@/lib/deckConfig";

interface CardFanProps {
    deck: DeckConfig;
    maxSelections?: number;
    onCardsSelected: (cards: CardDef[]) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function CardFan({ deck, maxSelections = 1, onCardsSelected }: CardFanProps) {
    const t = useTranslations();
    const [cards, setCards] = useState<CardDef[]>(() => shuffleArray(deck.cards));
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [shufflePhase, setShufflePhase] = useState<'none' | 'gather' | 'mix' | 'fan'>('none');
    const [isCutting, setIsCutting] = useState(false);
    const [cutPhase, setCutPhase] = useState<'none' | 'stack' | 'split' | 'merge'>('none');
    const [isRevealed, setIsRevealed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [hasSpread, setHasSpread] = useState(false);
    // Ref to track selections synchronously and prevent race-condition on rapid clicks
    const selectionCountRef = useRef(0);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        setCards(shuffleArray(deck.cards));
        setSelectedIndices([]);
        selectionCountRef.current = 0;
        setHighlightedIndex(null);
        setIsRevealed(false);
        setHasSpread(false);
        const timer = setTimeout(() => setHasSpread(true), 100);
        return () => clearTimeout(timer);
    }, [deck]);

    useEffect(() => {
        const timer = setTimeout(() => setHasSpread(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Dynamic fan layout computation
    const fanLayout = useMemo(() => {
        const total = cards.length;
        // Limit visible cards for performance with large decks
        const maxVisible = isMobile ? 25 : 45;
        const step = total > maxVisible ? Math.ceil(total / maxVisible) : 1;
        const visibleIndices: number[] = [];
        for (let i = 0; i < total; i += step) {
            visibleIndices.push(i);
        }
        // Ensure last card is included
        if (visibleIndices[visibleIndices.length - 1] !== total - 1) {
            visibleIndices.push(total - 1);
        }

        const spreadAngle = isMobile ? 100 : 140;
        const startAngle = -spreadAngle / 2;
        const angleStep =
            visibleIndices.length > 1
                ? spreadAngle / (visibleIndices.length - 1)
                : 0;

        return visibleIndices.map((cardIndex, i) => ({
            cardIndex,
            rotation: startAngle + angleStep * i,
            fanPosition: i,
            totalVisible: visibleIndices.length,
        }));
    }, [cards.length, isMobile]);

    const handleShuffle = useCallback(() => {
        if (isShuffling || isCutting || selectedIndices.length > 0) return;
        setIsShuffling(true);
        setHighlightedIndex(null);

        // Phase 1: Gather into stack
        setShufflePhase('gather');

        // Phase 2: The Wash (Mix)
        setTimeout(() => {
            setShufflePhase('mix');
            // Actually shuffle the array in the background during the mix
            setCards(shuffleArray(deck.cards));
        }, 500);

        // Phase 3: Prepare to Fan
        setTimeout(() => {
            setShufflePhase('fan');
        }, 1800);

        // Phase 4: Spread the Fan out
        setTimeout(() => {
            setShufflePhase('none');
            setIsShuffling(false);
        }, 2200);
    }, [isShuffling, isCutting, selectedIndices.length, deck.cards]);

    const handleCut = useCallback(() => {
        if (isShuffling || isCutting || selectedIndices.length > 0) return;
        setIsCutting(true);
        setHighlightedIndex(null);

        // Phase 1: Stack tight
        setCutPhase('stack');

        // Phase 2: Split
        setTimeout(() => {
            setCutPhase('split');
        }, 500);

        // Phase 3: Merge (Left over Right)
        setTimeout(() => {
            setCutPhase('merge');
        }, 1000);

        // Phase 4: Complete into Fan & Logical swap
        setTimeout(() => {
            setCards(prevCards => {
                const mid = Math.floor(prevCards.length / 2);
                const topHalf = prevCards.slice(0, mid);
                const bottomHalf = prevCards.slice(mid);
                return [...bottomHalf, ...topHalf]; // Left onto right
            });
            setCutPhase('none');
            setIsCutting(false);
        }, 1600);

    }, [isShuffling, isCutting, selectedIndices.length]);

    const handleCardClick = useCallback(
        (cardIndex: number) => {
            if (isShuffling || isCutting) return;
            // Increment ref SYNCHRONOUSLY before any setState — this blocks rapid clicks immediately
            if (selectionCountRef.current >= maxSelections) return;
            selectionCountRef.current += 1;

            setSelectedIndices(prev => {
                if (prev.includes(cardIndex)) {
                    // Revert ref if card was already selected
                    selectionCountRef.current -= 1;
                    return prev;
                }

                const newSelections = [...prev, cardIndex];

                if (newSelections.length === maxSelections) {
                    setTimeout(() => setIsRevealed(true), 600);
                    setTimeout(() => {
                        onCardsSelected(newSelections.map(i => cards[i]));
                    }, 1500);
                }

                return newSelections;
            });
        },
        [isShuffling, isCutting, maxSelections, cards, onCardsSelected]
    );

    const handleSliderChange = useCallback((value: number) => {
        setHighlightedIndex(Math.round(value));
    }, []);

    const cardW = isMobile ? 60 : 90;
    const cardH = isMobile ? 96 : 144;
    // Fan radius — determines the curve
    const fanRadius = isMobile ? 280 : 420;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-full"
        >
            {/* Instruction text */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6 flex flex-col items-center gap-2"
            >
                <p className="text-mystic-200/70 text-sm md:text-base text-center">
                    {isMobile ? t("cards.useSlider") : t("cards.clickToSelect")}
                </p>
                {maxSelections > 1 && (
                    <div className="bg-mystic-900/50 px-4 py-1.5 rounded-full border border-gold-500/30 text-gold-300 text-sm font-semibold tracking-wide">
                        {selectedIndices.length} / {maxSelections}
                    </div>
                )}
            </motion.div>

            {/* Fan container */}
            <div
                className="relative"
                style={{
                    width: "100%",
                    maxWidth: isMobile ? 400 : 900,
                    height: isMobile ? 360 : 500, // Increased height to accommodate lower fan
                }}
            >
                <AnimatePresence>
                    {hasSpread &&
                        fanLayout.map(({ cardIndex, rotation, fanPosition, totalVisible }) => {
                            const card = cards[cardIndex];
                            if (!card) return null;

                            const isSelected = selectedIndices.includes(cardIndex);
                            const selectionOrder = selectedIndices.indexOf(cardIndex);
                            const isHighlighted = highlightedIndex === cardIndex;
                            const angleRad = (rotation * Math.PI) / 180;

                            // Position cards along an arc
                            const cx = isMobile ? 200 : 450; // center x
                            const cy = isMobile ? 420 : 580; // pivot y (shifted down)
                            const cardX = cx + fanRadius * Math.sin(angleRad) - cardW / 2;
                            const cardY = cy - fanRadius * Math.cos(angleRad) - cardH;

                            const symbols = ["✦", "✧", "◆", "❖", "⬡", "☽", "☀", "⚝"];
                            const symbol = symbols[cardIndex % symbols.length];

                            return (
                                <motion.div
                                    key={`${deck.id}-${card.id}`}
                                    className="absolute"
                                    initial={{
                                        x: cx - cardW / 2,
                                        y: cy - cardH,
                                        rotate: 0,
                                        scale: 0.3,
                                        opacity: 0,
                                    }}
                                    animate={
                                        isSelected
                                            ? {
                                                x: cx - cardW / 2 + (selectionOrder - (maxSelections - 1) / 2) * (isMobile ? 35 : 55),
                                                y: isMobile ? 120 : 160 + Math.abs(selectionOrder - (maxSelections - 1) / 2) * 10,
                                                rotate: (selectionOrder - (maxSelections - 1) / 2) * 5,
                                                scale: isMobile ? (maxSelections > 1 ? 1.1 : 1.3) : (maxSelections > 1 ? 1.2 : 1.4),
                                                zIndex: 1000 + selectionOrder,
                                                opacity: 1,
                                            }
                                            : isShuffling
                                                ? {
                                                    // "Wash" Shuffle Animation Logic
                                                    x: shufflePhase === 'gather'
                                                        ? cx - cardW / 2 // Gather to center
                                                        : shufflePhase === 'mix'
                                                            // Chaotic spread and orbiting
                                                            ? cx - cardW / 2 + Math.cos((rotation + Date.now() / 100) * (Math.PI / 180)) * (isMobile ? 120 : 220) + (Math.random() - 0.5) * 50
                                                            : cx - cardW / 2, // 'fan' phase - tight stack before layout kicks in
                                                    y: shufflePhase === 'gather'
                                                        ? cy - cardH - 20 - (fanPosition * 0.5)
                                                        : shufflePhase === 'mix'
                                                            // Up/Down swirling
                                                            ? cy - cardH - 100 + Math.sin((rotation - Date.now() / 100) * (Math.PI / 180)) * (isMobile ? 80 : 150) + (Math.random() - 0.5) * 50
                                                            : cy - cardH - 20 - (fanPosition * 0.5),
                                                    rotate: shufflePhase === 'mix'
                                                        ? rotation + Date.now() / 10 + (Math.random() - 0.5) * 180
                                                        : 0,
                                                    scale: shufflePhase === 'mix' ? 0.9 : 1,
                                                    opacity: 1,
                                                    zIndex: Math.floor(Math.random() * totalVisible),
                                                }
                                                : cutPhase !== 'none'
                                                    ? {
                                                        // Basic Cut Animation Logic (Left over Right)
                                                        x: cutPhase === 'stack'
                                                            ? cx - cardW / 2
                                                            : cutPhase === 'split'
                                                                // Split L/R
                                                                ? (cardIndex < cards.length / 2 ? cx - cardW - (isMobile ? 10 : 20) : cx + (isMobile ? 10 : 20))
                                                                : cutPhase === 'merge'
                                                                    // Left over Right -> Right stays, Left moves right
                                                                    ? (cardIndex < cards.length / 2 ? cx + (isMobile ? 10 : 20) : cx + (isMobile ? 10 : 20))
                                                                    : cx - cardW / 2,
                                                        y: cutPhase === 'stack'
                                                            ? cy - cardH - 20 - (fanPosition * 0.5)
                                                            : cutPhase === 'split'
                                                                ? cy - cardH - 20 - (fanPosition * 0.5)
                                                                : cutPhase === 'merge'
                                                                    // Left half drops on top
                                                                    ? (cardIndex < cards.length / 2 ? cy - cardH - 25 - (cards.length * 0.5) : cy - cardH - 20 - (fanPosition * 0.5))
                                                                    : cy - cardH - 20,
                                                        rotate: 0,
                                                        scale: 1,
                                                        opacity: 1,
                                                        zIndex: cutPhase === 'merge' && cardIndex < cards.length / 2 ? 1000 + fanPosition : fanPosition, // Left on top
                                                    }
                                                    : {
                                                        x: cardX,
                                                        y: cardY,
                                                        rotate: rotation,
                                                        scale: isHighlighted ? 1.12 : 1,
                                                        opacity: 1,
                                                        zIndex: isHighlighted ? 500 : fanPosition,
                                                    }
                                    }
                                    transition={
                                        isSelected
                                            ? { type: "spring", stiffness: 100, damping: 18 }
                                            : isShuffling
                                                ? shufflePhase === 'mix'
                                                    ? { duration: 1.3, ease: "easeInOut" } // Slow dramatic mix
                                                    : { type: "spring", stiffness: 150, damping: 20 } // Quick gather
                                                : cutPhase !== 'none'
                                                    ? { type: "spring", stiffness: 90, damping: 15 } // Smooth basic cut
                                                    : {
                                                        type: "spring",
                                                        stiffness: 120,
                                                        damping: 22,
                                                        delay: fanPosition * 0.015,
                                                    }
                                    }
                                    whileHover={
                                        !isSelected && !isShuffling && !isCutting && selectedIndices.length < maxSelections
                                            ? { y: cardY - 20, scale: 1.1, zIndex: 999 }
                                            : undefined
                                    }
                                    onHoverStart={() => !isShuffling && !isCutting && setHighlightedIndex(cardIndex)}
                                    onHoverEnd={() => !isShuffling && !isCutting && setHighlightedIndex(null)}
                                    onClick={() => !isShuffling && !isCutting && handleCardClick(cardIndex)}
                                    style={{
                                        width: cardW,
                                        height: cardH,
                                        zIndex: isSelected ? 1000 : isHighlighted ? 500 : fanPosition,
                                        cursor: isSelected || selectedIndices.length >= maxSelections ? 'default' : 'pointer',
                                        opacity: !isSelected && selectedIndices.length >= maxSelections ? 0.45 : 1,
                                    }}
                                >
                                    {/* Card flip container */}
                                    <motion.div
                                        className="relative w-full h-full"
                                        style={{ transformStyle: "preserve-3d", perspective: 800 }}
                                        animate={{
                                            rotateY: isRevealed && isSelected ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.6, delay: isSelected ? 0.4 : 0 }}
                                    >
                                        {/* Card Back */}
                                        <div
                                            className={`absolute inset-0 rounded-lg flex flex-col items-center justify-center gap-1 overflow-hidden transition-all duration-300
                                                ${deck.backImage ? "bg-mystic-900" : "card-back card-back-pattern"} 
                                                ${isHighlighted && !isSelected ? "border-2 border-gold-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] glow-gold scale-[1.02]" : "border border-transparent"}
                                            `}
                                            style={{ backfaceVisibility: "hidden" }}
                                        >
                                            {deck.backImage ? (
                                                <img
                                                    src={deck.backImage}
                                                    alt="Card Back"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <>
                                                    <div className="text-gold-400 text-lg opacity-60">
                                                        {symbol}
                                                    </div>
                                                    <div className="w-6 h-[1px] bg-gold-500/30" />
                                                    <div className="text-gold-500/40 text-[7px] font-semibold tracking-[2px] uppercase">
                                                        MYSTIC
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Card Front */}
                                        <div
                                            className="absolute inset-0 rounded-lg card-front flex flex-col items-center justify-center p-2 text-center"
                                            style={{
                                                backfaceVisibility: "hidden",
                                                transform: "rotateY(180deg)",
                                            }}
                                        >
                                            <div className="text-2xl mb-1">
                                                {card.arcana === "major" ? "🌟" : "✨"}
                                            </div>
                                            <div
                                                className="text-gold-300 font-bold text-[8px] leading-tight mb-1"
                                                style={{ fontFamily: "var(--font-display)" }}
                                            >
                                                {card.name}
                                            </div>
                                            <div className="w-6 h-[1px] bg-gold-500/40" />
                                            <div className="text-mystic-200/60 text-[7px] mt-1">
                                                #{cardIndex + 1}
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                </AnimatePresence>
            </div>

            {/* Mobile slider */}
            {isMobile && selectedIndices.length < maxSelections && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="w-full max-w-sm mt-4 px-4"
                >
                    <div className="flex items-center justify-between text-xs text-mystic-300 mb-2">
                        <span>{t("cards.cardNumber")} 1</span>
                        <span>
                            {t("cards.cardNumber")} {cards.length}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={fanLayout.length - 1}
                        step={1}
                        value={
                            highlightedIndex !== null
                                ? fanLayout.findIndex((f) => f.cardIndex === highlightedIndex)
                                : 0
                        }
                        onChange={(e) => {
                            const fi = Number(e.target.value);
                            if (fanLayout[fi]) {
                                handleSliderChange(fanLayout[fi].cardIndex);
                            }
                        }}
                        className="card-slider w-full"
                    />
                    {highlightedIndex !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center mt-3"
                        >
                            <button
                                onClick={() => handleCardClick(highlightedIndex)}
                                className="btn-outline text-sm px-6 py-2"
                            >
                                {t("cards.tapToSelect")} #{highlightedIndex + 1}
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Action buttons */}
            {selectedIndices.length === 0 && (
                <div className="flex flex-row items-center justify-center gap-4 mt-8">
                    <ShuffleButton onShuffle={handleShuffle} isShuffling={isShuffling} />
                    <CutButton onCut={handleCut} isCutting={isCutting} disabled={isShuffling} />
                </div>
            )}

            {/* Card count */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-4 text-mystic-300/50 text-xs tracking-widest uppercase"
            >
                {deck.totalCards} {t("deck.cardsInDeck")}
            </motion.div>
        </motion.div>
    );
}
