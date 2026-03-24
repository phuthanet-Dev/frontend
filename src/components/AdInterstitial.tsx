"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import AdBanner from "./AdBanner";

interface AdInterstitialProps {
    isOpen: boolean;
    onClose: () => void;
    onAdComplete: () => void;
    onOpenVip: () => void;
}

const AD_DURATION = 5; // seconds

export default function AdInterstitial({
    isOpen,
    onClose,
    onAdComplete,
    onOpenVip,
}: AdInterstitialProps) {
    const t = useTranslations();
    const [countdown, setCountdown] = useState(AD_DURATION);
    const [isWatching, setIsWatching] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCountdown(AD_DURATION);
            setIsWatching(false);
            setIsComplete(false);
        }
    }, [isOpen]);

    // Countdown timer
    useEffect(() => {
        if (!isWatching || isComplete) return;

        if (countdown <= 0) {
            setIsComplete(true);
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [isWatching, countdown, isComplete]);

    const handleWatchAd = useCallback(() => {
        setIsWatching(true);
    }, []);

    const handleClaimReading = useCallback(() => {
        onAdComplete();
        onClose();
    }, [onAdComplete, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: "rgba(10, 10, 26, 0.85)" }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="glass rounded-3xl p-8 md:p-10 max-w-md w-full text-center relative overflow-hidden"
                    >
                        {/* Decorative glow */}
                        <div
                            className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
                            style={{
                                background:
                                    "radial-gradient(circle, var(--color-accent-purple), transparent)",
                            }}
                        />
                        <div
                            className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
                            style={{
                                background:
                                    "radial-gradient(circle, var(--color-gold-500), transparent)",
                            }}
                        />

                        {!isWatching && !isComplete && (
                            /* Initial state: Prompt to watch ad */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative z-10"
                            >
                                <div className="text-5xl mb-4">🔮</div>
                                <h3
                                    className="text-2xl font-bold glow-text mb-3"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    {t("freemium.watchAdTitle")}
                                </h3>
                                <p className="text-mystic-200/70 text-sm mb-6 leading-relaxed">
                                    {t("freemium.watchAdDesc")}
                                </p>

                                <div className="flex flex-col gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleWatchAd}
                                        className="btn-mystic text-base cursor-pointer"
                                    >
                                        📺 {t("freemium.watchAd")}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onOpenVip}
                                        className="btn-outline text-sm cursor-pointer"
                                    >
                                        ✨ {t("freemium.unlimitedAccess")}
                                    </motion.button>

                                    <button
                                        onClick={onClose}
                                        className="text-mystic-300/40 hover:text-mystic-200 text-xs mt-2 transition-colors cursor-pointer"
                                    >
                                        {t("freemium.close")}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {isWatching && !isComplete && (
                            /* Watching state: Countdown + Ad */
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative z-10"
                            >
                                <div className="mb-6">
                                    {/* Countdown ring */}
                                    <div className="relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-4">
                                        <svg
                                            className="w-20 h-20 -rotate-90"
                                            viewBox="0 0 80 80"
                                        >
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="35"
                                                stroke="rgba(75, 63, 138, 0.3)"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <motion.circle
                                                cx="40"
                                                cy="40"
                                                r="35"
                                                stroke="var(--color-gold-400)"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeLinecap="round"
                                                initial={{
                                                    strokeDasharray: "220",
                                                    strokeDashoffset: "0",
                                                }}
                                                animate={{
                                                    strokeDashoffset: "220",
                                                }}
                                                transition={{
                                                    duration: AD_DURATION,
                                                    ease: "linear",
                                                }}
                                            />
                                        </svg>
                                        <span className="absolute text-2xl font-bold text-gold-400">
                                            {countdown}
                                        </span>
                                    </div>
                                    <p className="text-mystic-200/70 text-sm">
                                        {t("freemium.watching", { seconds: countdown })}
                                    </p>
                                </div>

                                {/* Ad display area */}
                                <AdBanner
                                    adFormat="rectangle"
                                    className="mb-4"
                                />
                            </motion.div>
                        )}

                        {isComplete && (
                            /* Complete state: Claim reading */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", damping: 15 }}
                                className="relative z-10"
                            >
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.6 }}
                                    className="text-6xl mb-4"
                                >
                                    🎉
                                </motion.div>
                                <h3
                                    className="text-2xl font-bold glow-text mb-3"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    {t("freemium.adComplete")}
                                </h3>
                                <p className="text-mystic-200/70 text-sm mb-6">
                                    {t("freemium.adCompleteDesc")}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClaimReading}
                                    className="btn-mystic text-base cursor-pointer"
                                >
                                    🔮 {t("freemium.claimReading")}
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
