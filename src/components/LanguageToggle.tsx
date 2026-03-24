"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface LanguageToggleProps {
    currentLocale: string;
    onLocaleChange: (locale: string) => void;
}

const LOCALES = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "th", label: "TH", flag: "🇹🇭" },
];

export default function LanguageToggle({
    currentLocale,
    onLocaleChange,
}: LanguageToggleProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations();

    const currentLang = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="glass rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer transition-all hover:border-gold-500/40"
            >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="text-sm font-semibold text-mystic-100">
                    {currentLang.label}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-mystic-300 text-xs"
                >
                    ▼
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 glass rounded-xl overflow-hidden min-w-[120px] z-50"
                    >
                        {LOCALES.map((locale) => (
                            <button
                                key={locale.code}
                                onClick={() => {
                                    onLocaleChange(locale.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 flex items-center gap-3 text-sm transition-all cursor-pointer ${currentLocale === locale.code
                                        ? "bg-gold-500/10 text-gold-300"
                                        : "text-mystic-100 hover:bg-mystic-600/50"
                                    }`}
                            >
                                <span className="text-lg">{locale.flag}</span>
                                <span className="font-medium">{locale.label}</span>
                                {currentLocale === locale.code && (
                                    <span className="ml-auto text-gold-400">✓</span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
