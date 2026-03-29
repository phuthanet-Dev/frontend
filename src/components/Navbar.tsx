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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full py-4 px-6 flex items-center justify-between glass-dark sticky top-0 z-50 shadow-md backdrop-blur-md"
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

                {/* Center: Main Navigation */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
                    <a
                        href="/"
                        className="text-sm font-semibold text-mystic-200 hover:text-gold-300 transition-colors"
                    >
                        {t("nav.home")}
                    </a>

                    {/* How to Use Dropdown */}
                    <div className="relative group">
                        <button className="text-sm font-semibold text-mystic-200 hover:text-gold-300 transition-colors flex items-center gap-1 py-4">
                            {t("nav.howToUse")}
                            <span className="text-[10px] opacity-70 group-hover:rotate-180 transition-transform">▼</span>
                        </button>
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div className="bg-mystic-900 border border-mystic-600/50 rounded-xl shadow-2xl overflow-hidden py-2 min-w-[200px]">
                                <a
                                    href="/articles/how-to-use-app"
                                    className="block px-4 py-3 text-sm text-mystic-100 hover:bg-mystic-800 hover:text-gold-300 transition-colors"
                                >
                                    {t("nav.guideApp")}
                                </a>
                                <a
                                    href="/articles/how-to-topup"
                                    className="block px-4 py-3 text-sm text-mystic-100 hover:bg-mystic-800 hover:text-gold-300 transition-colors"
                                >
                                    {t("nav.guideTopup")}
                                </a>
                            </div>
                        </div>
                    </div>

                    <a
                        href="/articles"
                        className="text-sm font-semibold text-mystic-200 hover:text-gold-300 transition-colors"
                    >
                        {t("nav.articles")}
                    </a>
                </div>

                {/* Right side: Auth + Language toggle + Mobile Menu Toggle */}
                <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                    {loading ? (
                        <div className="hidden md:block w-16 h-8 animate-pulse bg-mystic-500/50 rounded-full" />
                    ) : user ? (
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Coin Balance - Always show, but styling might adjust slightly for mobile */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsTopUpOpen(true)}
                                className="flex items-center gap-1.5 sm:gap-2 bg-mystic-800/80 border border-gold-500/30 px-2 sm:px-3 py-1.5 rounded-full hover:border-gold-400 transition-colors"
                            >
                                <span className="text-gold-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">💰</span>
                                <span className="font-bold text-sm text-gold-100">{coinBalance}</span>
                            </motion.button>

                            <div className="hidden md:block h-4 w-px bg-mystic-500/30 mx-1" />

                            <div className="hidden md:flex items-center gap-3">
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
                    
                    {/* Language Toggle - Only show on desktop, move to hamburger for mobile */}
                    <div className="hidden md:block">
                        <LanguageToggle
                            currentLocale={currentLocale}
                            onLocaleChange={onLocaleChange}
                        />
                    </div>
                    
                    {/* Mobile Menu Toggle Button */}
                    <button 
                        className="md:hidden text-gold-300 p-2 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden fixed top-[72px] left-0 right-0 bottom-0 glass-dark border-t border-mystic-700 shadow-xl z-[1100] p-4 overflow-y-auto"
                >
                    <div className="flex flex-col gap-4">
                        <a
                            href="/"
                            className="text-base font-semibold text-mystic-200 hover:text-gold-300 p-2 border-b border-mystic-800"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t("nav.home")}
                        </a>
                        
                        <div className="flex flex-col gap-2 p-2 border-b border-mystic-800">
                            <span className="text-sm text-mystic-400 font-medium uppercase">{t("nav.howToUse")}</span>
                            <a
                                href="/articles/how-to-use-app"
                                className="text-base font-semibold text-mystic-200 hover:text-gold-300 pl-4 py-1"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t("nav.guideApp")}
                            </a>
                            <a
                                href="/articles/how-to-topup"
                                className="text-base font-semibold text-mystic-200 hover:text-gold-300 pl-4 py-1"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t("nav.guideTopup")}
                            </a>
                        </div>

                        <a
                            href="/articles"
                            className="text-base font-semibold text-mystic-200 hover:text-gold-300 p-2 border-b border-mystic-800"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t("nav.articles")}
                        </a>
                        
                        {/* Language Selection for Mobile */}
                        <div className="flex items-center justify-between p-2 border-b border-mystic-800">
                            <span className="text-base font-semibold text-mystic-200">{t("nav.language")}</span>
                            <LanguageToggle
                                currentLocale={currentLocale}
                                onLocaleChange={(newLocale) => {
                                    onLocaleChange(newLocale);
                                    setIsMobileMenuOpen(false);
                                }}
                            />
                        </div>

                        {/* Mobile Auth/User Section */}
                        <div className="pt-2 p-2">
                            {loading ? (
                                <div className="w-full h-10 animate-pulse bg-mystic-500/50 rounded-lg" />
                            ) : user ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {user.photoURL ? (
                                                <AvatarImage photoURL={user.photoURL} email={user.email} />
                                            ) : (
                                                <div
                                                    className="w-8 h-8 rounded-full border border-gold-400 flex items-center justify-center text-sm font-bold text-gold-900 uppercase select-none"
                                                    style={{ background: "linear-gradient(135deg, var(--color-gold-300), var(--color-gold-500))" }}
                                                >
                                                    {user.email?.charAt(0) ?? "?"}
                                                </div>
                                            )}
                                            <span className="text-sm text-mystic-100 font-medium">
                                                {user.displayName || user.email?.split("@")[0]}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="text-sm text-mystic-300 hover:text-red-400 transition-colors"
                                        >
                                            {t("nav.signOut")}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsTopUpOpen(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-2 bg-mystic-800/80 border border-gold-500/50 px-4 py-3 rounded-xl hover:border-gold-400 transition-colors w-full"
                                    >
                                        <span className="text-gold-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] text-xl">💰</span>
                                        <span className="font-bold text-gold-100">{coinBalance} Coins</span>
                                        <span className="text-xs text-gold-300/70 ml-auto">+ {t("nav.topup")}</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        onOpenAuthModal();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full btn-outline text-sm px-4 py-3"
                                >
                                    {t("nav.signIn")}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Render outside nav so fixed positioning works correctly */}
            <CoinTopUpModal
                isOpen={isTopUpOpen}
                onClose={() => setIsTopUpOpen(false)}
            />
        </>
    );
}
