"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import LanguageToggle from "./LanguageToggle";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import CoinTopUpModal from "./CoinTopUpModal";

interface NavbarProps {
    currentLocale: string;
    onLocaleChange: (locale: string) => void;
}

function AvatarImage({ photoURL, email }: { photoURL: string; email: string | null }) {
    const [failed, setFailed] = useState(false);
    const letter = email?.charAt(0) ?? "?";
    const fallback = (
        <div
            className="w-7 h-7 rounded-full border border-gold-400 flex items-center justify-center text-xs font-bold text-gold-900 uppercase select-none"
            style={{ background: "linear-gradient(135deg, var(--color-gold-300), var(--color-gold-500))" }}
            title={email ?? ""}
        >
            {letter}
        </div>
    );

    if (failed) return fallback;
    return (
        <Image
            src={photoURL}
            alt="Profile"
            width={28}
            height={28}
            className="rounded-full border border-gold-400"
            onError={() => setFailed(true)}
            unoptimized
        />
    );
}

export default function Navbar({ currentLocale, onLocaleChange, onOpenAuthModal }: NavbarProps & { onOpenAuthModal: () => void }) {
    const t = useTranslations();
    const { user, loading, coinBalance, signOut } = useAuth();
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full py-4 px-6 flex items-center justify-between glass-dark z-40"
            >
                {/* Logo / Brand */}
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="text-3xl"
                    >
                        🔮
                    </motion.div>
                    <div>
                        <h1
                            className="text-xl md:text-2xl font-bold text-gold-300 glow-text"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Mystic Cards
                        </h1>
                        <p className="text-[10px] text-mystic-300/60 tracking-[4px] uppercase hidden sm:block">
                            {t("app.subtitle")}
                        </p>
                    </div>
                </div>

                {/* Right side: Nav links + Language toggle */}
                <div className="flex items-center gap-4">
                    {/* Phase 2: Marketplace — hidden for now */}
                    {/* <motion.a
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    className="hidden md:block text-sm text-mystic-200 hover:text-gold-300 transition-colors"
                >
                    {t("nav.marketplace")}
                </motion.a> */}
                    {loading ? (
                        <div className="hidden md:block w-16 h-8 animate-pulse bg-mystic-500/50 rounded-full" />
                    ) : user ? (
                        <div className="hidden md:flex items-center gap-4">
                            {/* Coin Balance */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsTopUpOpen(true)}
                                className="flex items-center gap-2 bg-mystic-800/80 border border-gold-500/30 px-3 py-1.5 rounded-full hover:border-gold-400 transition-colors"
                            >
                                <span className="text-gold-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">💰</span>
                                <span className="font-bold text-sm text-gold-100">{coinBalance}</span>
                            </motion.button>

                            <div className="h-4 w-px bg-mystic-500/30 mx-1" />

                            {user.photoURL ? (
                                <AvatarImage photoURL={user.photoURL} email={user.email} />
                            ) : (
                                <div
                                    className="w-7 h-7 rounded-full border border-gold-400 flex items-center justify-center text-xs font-bold text-gold-900 uppercase select-none"
                                    style={{ background: "linear-gradient(135deg, var(--color-gold-300), var(--color-gold-500))" }}
                                    title={user.email ?? ""}
                                >
                                    {user.email?.charAt(0) ?? "?"}
                                </div>
                            )}
                            <span className="text-sm text-mystic-100 hidden lg:block">
                                {user.displayName?.split(" ")[0]}
                            </span>
                            <motion.button
                                onClick={signOut}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-xs text-mystic-300 hover:text-mystic-100 transition-colors"
                            >
                                {t("nav.signOut")}
                            </motion.button>
                        </div>
                    ) : (
                        <motion.button
                            onClick={onOpenAuthModal}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden md:block btn-outline text-xs px-4 py-2"
                        >
                            {t("nav.signIn")}
                        </motion.button>
                    )}
                    <LanguageToggle
                        currentLocale={currentLocale}
                        onLocaleChange={onLocaleChange}
                    />
                </div>
            </motion.nav>

            {/* Render outside nav so fixed positioning works correctly */}
            <CoinTopUpModal
                isOpen={isTopUpOpen}
                onClose={() => setIsTopUpOpen(false)}
            />
        </>
    );
}
