"use client";

import { motion } from "framer-motion";

interface CardItemProps {
    index: number;
    totalCards: number;
    cardWidth: number;
    cardHeight: number;
    isSelected: boolean;
    isRevealed: boolean;
    isHighlighted: boolean;
    isShuffling: boolean;
    cardName: string;
    rotation: number;
    originX: number;
    originY: number;
    onClick: () => void;
}

export default function CardItem({
    index,
    totalCards,
    cardWidth,
    cardHeight,
    isSelected,
    isRevealed,
    isHighlighted,
    isShuffling,
    cardName,
    rotation,
    onClick,
}: CardItemProps) {
    // Card symbol for the back decoration
    const symbols = ["✦", "✧", "◆", "❖", "⬡", "☽", "☀", "⚝"];
    const symbol = symbols[index % symbols.length];

    return (
        <motion.div
            className="absolute cursor-pointer card-perspective"
            style={{
                width: cardWidth,
                height: cardHeight,
                originX: 0.5,
                originY: 1,
                zIndex: isSelected ? 1000 : isHighlighted ? 500 : index,
            }}
            // Fan position animation
            animate={
                isSelected
                    ? {
                        // Fly to center
                        x: 0,
                        y: -cardHeight * 0.5,
                        rotate: 0,
                        scale: 1.8,
                        zIndex: 1000,
                    }
                    : isShuffling
                        ? {
                            // Shuffle: collapse to center then re-spread
                            x: Math.sin(index * 0.3) * 5,
                            y: -20 + Math.cos(index * 0.5) * 10,
                            rotate: (Math.random() - 0.5) * 30,
                            scale: 0.9,
                            zIndex: Math.floor(Math.random() * totalCards),
                        }
                        : {
                            // Fan position
                            rotate: rotation,
                            x: 0,
                            y: 0,
                            scale: isHighlighted ? 1.08 : 1,
                            zIndex: isHighlighted ? 500 : index,
                        }
            }
            initial={{
                rotate: 0,
                x: 0,
                y: 0,
                scale: 0.3,
                opacity: 0,
            }}
            transition={
                isSelected
                    ? {
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                        duration: 0.8,
                    }
                    : isShuffling
                        ? {
                            duration: 0.3,
                            delay: Math.random() * 0.1,
                        }
                        : {
                            type: "spring",
                            stiffness: 150,
                            damping: 25,
                            delay: index * 0.012,
                        }
            }
            whileHover={
                !isSelected && !isShuffling
                    ? { y: -15, scale: 1.06, zIndex: 999 }
                    : undefined
            }
            onClick={!isShuffling ? onClick : undefined}
        >
            {/* Card container for flip animation */}
            <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isRevealed && isSelected ? 180 : 0 }}
                transition={{ duration: 0.6, delay: isSelected ? 0.4 : 0 }}
            >
                {/* Card Back */}
                <div
                    className={`absolute inset-0 rounded-xl card-back card-back-pattern card-face flex flex-col items-center justify-center gap-2 ${isHighlighted && !isSelected ? "glow-gold" : ""
                        }`}
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <div className="text-gold-400 text-2xl opacity-60">{symbol}</div>
                    <div className="w-10 h-[1px] bg-gold-500/30" />
                    <div className="text-gold-500/40 text-[9px] font-semibold tracking-[3px] uppercase">
                        MYSTIC
                    </div>
                </div>

                {/* Card Front (revealed) */}
                <div
                    className="absolute inset-0 rounded-xl card-front card-face flex flex-col items-center justify-center p-3 text-center"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <div className="text-3xl mb-2">
                        {index < 22 ? "🌟" : "✨"}
                    </div>
                    <div
                        className="text-gold-300 font-bold text-xs leading-tight mb-1"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        {cardName}
                    </div>
                    <div className="w-8 h-[1px] bg-gold-500/40 my-1" />
                    <div className="text-mystic-200/60 text-[10px]">
                        #{index + 1}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
