"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface CutButtonProps {
    onCut: () => void;
    isCutting: boolean;
    disabled?: boolean;
}

export default function CutButton({
    onCut,
    isCutting,
    disabled = false
}: CutButtonProps) {
    const t = useTranslations("cards");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-8"
        >
            <motion.button
                whileHover={!isCutting && !disabled ? { scale: 1.08 } : undefined}
                whileTap={!isCutting && !disabled ? { scale: 0.95 } : undefined}
                onClick={onCut}
                disabled={isCutting || disabled}
                className={`
          relative overflow-hidden px-8 py-4 rounded-full font-bold text-lg tracking-wide
          transition-all duration-300 cursor-pointer border
          ${isCutting || disabled
                        ? "bg-mystic-800/50 text-mystic-400 border-mystic-600 cursor-not-allowed"
                        : "bg-transparent text-gold-300 border-gold-500/50 hover:bg-gold-500/10 hover:border-gold-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] glow-gold"
                    }
        `}
                style={{ fontFamily: "var(--font-display)" }}
            >
                {/* Spinning/Cutting icon */}
                <span className="relative z-10 flex items-center gap-3">
                    <motion.span
                        animate={isCutting ? { rotate: [0, -20, 20, 0] } : { rotate: 0 }}
                        transition={
                            isCutting
                                ? { repeat: Infinity, duration: 0.5, ease: "easeInOut" }
                                : {}
                        }
                        className="text-xl"
                    >
                        ✂️
                    </motion.span>
                    {isCutting ? t("cutting") : t("cutDeck")}
                </span>
            </motion.button>
        </motion.div>
    );
}
