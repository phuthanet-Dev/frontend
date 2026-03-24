"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ShuffleButtonProps {
    onShuffle: () => void;
    isShuffling: boolean;
}

export default function ShuffleButton({
    onShuffle,
    isShuffling,
}: ShuffleButtonProps) {
    const t = useTranslations();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8"
        >
            <motion.button
                whileHover={!isShuffling ? { scale: 1.08 } : undefined}
                whileTap={!isShuffling ? { scale: 0.95 } : undefined}
                onClick={onShuffle}
                disabled={isShuffling}
                className={`
          relative overflow-hidden px-8 py-4 rounded-full font-bold text-lg tracking-wide
          transition-all duration-300 cursor-pointer
          ${isShuffling
                        ? "bg-mystic-600 text-mystic-300 cursor-wait"
                        : "btn-mystic"
                    }
        `}
                style={{ fontFamily: "var(--font-display)" }}
            >
                {/* Shimmer effect */}
                {!isShuffling && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 2.5,
                            ease: "easeInOut",
                            repeatDelay: 1,
                        }}
                    />
                )}

                {/* Spinning icon during shuffle */}
                <span className="relative z-10 flex items-center gap-3">
                    <motion.span
                        animate={isShuffling ? { rotate: 360 } : { rotate: 0 }}
                        transition={
                            isShuffling
                                ? { repeat: Infinity, duration: 0.6, ease: "linear" }
                                : {}
                        }
                        className="text-xl"
                    >
                        🔀
                    </motion.span>
                    {isShuffling ? t("cards.shuffling") : t("cards.shuffle")}
                </span>
            </motion.button>
        </motion.div>
    );
}
