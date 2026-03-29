"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { CardDef } from "@/lib/deckConfig";
import { useAuth } from "@/context/AuthContext";
import AdBanner from "./AdBanner";

interface ReadingResultProps {
    cards: CardDef[];
    readingType: string;
    readingsLeft?: number;
    userQuestion?: string;
    onNewReading: () => void;
    onOpenAuthModal: () => void;
}

/** Parse Gemini JSON response and extract the text */
function extractReadingText(raw: string): string {
    try {
        const json = JSON.parse(raw);
        const text =
            json?.candidates?.[0]?.content?.parts?.[0]?.text ??
            json?.text ??
            raw;
        return text;
    } catch {
        return raw;
    }
}

export default function ReadingResult({
    cards,
    readingType,
    readingsLeft,
    userQuestion,
    onNewReading,
    onOpenAuthModal,
}: ReadingResultProps) {
    const t = useTranslations();
    const [readingText, setReadingText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Wallpaper generation state
    const { user, coinBalance, fetchCoinBalance } = useAuth();
    const [wallpaperLoading, setWallpaperLoading] = useState(false);
    const [wallpaperResults, setWallpaperResults] = useState<{
        description: string;
        imageUrl: string;
        imagePrompt: string;
    }[]>([]);
    const [selectedWallpaperIndex, setSelectedWallpaperIndex] = useState(0);
    const [wallpaperError, setWallpaperError] = useState<string | null>(null);

    // Scroll to bottom when new content arrives
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [readingText, isLoading, wallpaperLoading, wallpaperResults]);

    const handleGenerateWallpaper = async () => {
        if (!user) {
            onOpenAuthModal();
            return;
        }
        if (coinBalance < 10) {
            setWallpaperError("เหรียญไม่เพียงพอ (ต้องใช้ 10 เหรียญ)");
            return;
        }

        setWallpaperLoading(true);
        setWallpaperError(null);

        try {
            const token = await user.getIdToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const res = await fetch(`${apiUrl}/api/wallpaper/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    focusArea: userQuestion || readingType,
                }),
            });

            if (res.status === 402) {
                setWallpaperError("เหรียญไม่เพียงพอ (ต้องใช้ 10 เหรียญ)");
                return;
            }
            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const data = await res.json();
            const newResult = {
                description: data.description,
                imageUrl: data.imageUrl,
                imagePrompt: data.imagePrompt,
            };
            setWallpaperResults((prev) => {
                const updated = [...prev, newResult];
                setSelectedWallpaperIndex(updated.length - 1);
                return updated;
            });
            await fetchCoinBalance();
        } catch (err: any) {
            setWallpaperError(err?.message || "ไม่สามารถสร้างวอลเปเปอร์ได้ในขณะนี้");
        } finally {
            setWallpaperLoading(false);
        }
    };

    // Call the backend API
    useEffect(() => {
        const fetchReading = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiUrl =
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
                const res = await fetch(`${apiUrl}/api/reading/generateReading`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cardNames: cards.map((c) => c.name),
                        focusArea: userQuestion || readingType,
                    }),
                });

                if (!res.ok) throw new Error(`API error: ${res.status}`);

                const raw = await res.text();
                const text = extractReadingText(raw);
                setReadingText(text);
            } catch (err: any) {
                setError(
                    err?.message || "ไม่สามารถเชื่อมต่อกับแม่หมอได้ในขณะนี้"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchReading();
    }, [cards, readingType, userQuestion]);

    /** Render the reading text with basic markdown-like formatting */
    function renderFormattedText(text: string) {
        return text.split("\n").map((line, i) => {
            // Bold: **text**
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            const rendered = parts.map((part, j) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                        <strong key={j} className="text-gold-300 font-semibold">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return <span key={j}>{part}</span>;
            });

            if (line.trim() === "") {
                return <br key={i} />;
            }

            // Bullet points
            if (line.trim().startsWith("- ") || line.trim().startsWith("* ") || line.trim().startsWith("• ")) {
                return (
                    <div key={i} className="flex gap-2 pl-2 my-1">
                        <span className="text-gold-400 shrink-0">•</span>
                        <span>{rendered}</span>
                    </div>
                );
            }

            return (
                <p key={i} className="my-1">
                    {rendered}
                </p>
            );
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto px-4 py-4 flex flex-col"
            style={{ minHeight: "calc(100vh - 180px)" }}
        >
            {/* Chat Container */}
            <div className="flex-1 flex flex-col gap-5 pb-6">

                {/* === User Bubble: Card images === */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-end"
                >
                    <div className="max-w-[85%] md:max-w-[75%]">
                        {/* User label */}
                        <div className="flex justify-end items-center gap-2 mb-1.5">
                            <span className="text-xs text-mystic-300/50">
                                {t("result.title")}
                            </span>
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-xs">
                                🙏
                            </div>
                        </div>

                        {/* Cards display */}
                        <div className="chat-bubble-user rounded-2xl rounded-tr-sm p-4">
                            {readingType === "question" && userQuestion && (
                                <p className="text-sm text-white/90 mb-3 italic">
                                    &quot;{userQuestion}&quot;
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2 justify-end">
                                {cards.map((card, i) => (
                                    <motion.div
                                        key={`card-${card.id}-${i}`}
                                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 + 0.2 }}
                                        className="chat-card-thumb"
                                    >
                                        <div className="text-2xl mb-1">
                                            {card.arcana === "major"
                                                ? "🌟"
                                                : card.suit
                                                    ? "✨"
                                                    : "🔮"}
                                        </div>
                                        <div className="text-[10px] leading-tight text-center text-gold-300 font-semibold">
                                            {card.name}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* === Fortune Teller Bubble: AI Response === */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-start"
                >
                    <div className="max-w-[85%] md:max-w-[75%]">
                        {/* Teller label */}
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center text-xs">
                                🔮
                            </div>
                            <span className="text-xs text-mystic-300/50">
                                แม่หมอ Mystic
                            </span>
                        </div>

                        {/* Response bubble */}
                        <div className="chat-bubble-teller rounded-2xl rounded-tl-sm p-5">
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="chat-typing-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <span className="text-sm text-mystic-300/60">
                                        กำลังดูดวงให้...
                                    </span>
                                </div>
                            ) : error ? (
                                <div className="text-accent-pink text-sm">
                                    ❌ {error}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-[15px] leading-relaxed text-mystic-100/90"
                                >
                                    {renderFormattedText(readingText)}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* === Wallpaper User Request Bubble === */}
                {(wallpaperLoading || wallpaperResults.length > 0 || wallpaperError) && (
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-end"
                    >
                        <div className="max-w-[85%] md:max-w-[75%]">
                            <div className="flex justify-end items-center gap-2 mb-1.5">
                                <span className="text-xs text-mystic-300/50">
                                    ขอวอลเปเปอร์เสริมดวง
                                </span>
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-xs">
                                    🙏
                                </div>
                            </div>
                            <div className="chat-bubble-user rounded-2xl rounded-tr-sm p-4">
                                <p className="text-sm text-white/90">
                                    สร้างวอลเปเปอร์เสริมดวง
                                    {userQuestion ? ` ด้าน "${userQuestion}"` : " ด้าน" + t(`reading.${readingType}` as any)}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* === Wallpaper Teller Response Bubble === */}
                {(wallpaperLoading || wallpaperResults.length > 0 || wallpaperError) && (
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex justify-start"
                    >
                        <div className="max-w-[85%] md:max-w-[75%]">
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center text-xs">
                                    🎨
                                </div>
                                <span className="text-xs text-mystic-300/50">
                                    แม่หมอ Mystic
                                </span>
                            </div>
                            <div className="chat-bubble-teller rounded-2xl rounded-tl-sm p-5">
                                {wallpaperLoading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="chat-typing-dots">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <span className="text-sm text-mystic-300/60">
                                            กำลังสร้างวอลเปเปอร์เสริมดวง...
                                        </span>
                                    </div>
                                ) : wallpaperError ? (
                                    <div className="text-accent-pink text-sm">
                                        ❌ {wallpaperError}
                                    </div>
                                ) : wallpaperResults.length > 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.8 }}
                                        className="flex flex-col gap-4"
                                    >
                                        <div className="text-[15px] leading-relaxed text-mystic-100/90">
                                            {renderFormattedText(wallpaperResults[selectedWallpaperIndex].description)}
                                        </div>
                                        <div className="rounded-xl overflow-hidden border border-gold-500/30">
                                            <img
                                                src={wallpaperResults[selectedWallpaperIndex].imageUrl}
                                                alt="วอลเปเปอร์เสริมดวง"
                                                className="w-full h-auto"
                                            />
                                        </div>
                                        {/* Thumbnail gallery */}
                                        {wallpaperResults.length > 1 && (
                                            <div className="flex flex-col gap-2">
                                                <span className="text-xs text-mystic-300/50">เลือกวอลเปเปอร์ ({wallpaperResults.length} รูป)</span>
                                                <div className="flex gap-2 overflow-x-auto pb-1">
                                                    {wallpaperResults.map((wp, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setSelectedWallpaperIndex(idx)}
                                                            className={`shrink-0 w-16 h-28 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                                                idx === selectedWallpaperIndex
                                                                    ? "border-gold-400 shadow-lg shadow-gold-500/30 scale-105"
                                                                    : "border-mystic-600/40 opacity-60 hover:opacity-90"
                                                            }`}
                                                        >
                                                            <img
                                                                src={wp.imageUrl}
                                                                alt={`วอลเปเปอร์ #${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            <a
                                                href={wallpaperResults[selectedWallpaperIndex].imageUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download={`mystic-wallpaper-${selectedWallpaperIndex + 1}.png`}
                                                className="inline-flex items-center justify-center gap-2 text-sm text-gold-300 hover:text-gold-200 bg-mystic-800/60 rounded-xl px-4 py-2.5 border border-gold-500/30 hover:border-gold-400/50 transition-all"
                                            >
                                                📥 ดาวน์โหลดวอลเปเปอร์
                                            </a>
                                            <button
                                                onClick={handleGenerateWallpaper}
                                                disabled={wallpaperLoading}
                                                className="inline-flex items-center justify-center gap-2 text-sm text-purple-300 hover:text-purple-200 bg-mystic-800/60 rounded-xl px-4 py-2.5 border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                🎨 สร้างใหม่ <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">10 🪙</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : null}
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Bottom Bar */}
            {!isLoading && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center gap-4 pt-4 border-t border-mystic-600/30"
                >
                    {/* Ad banner */}
                    <AdBanner adFormat="horizontal" />

                    {/* Readings remaining */}
                    {readingsLeft !== undefined && (
                        <span className="inline-flex items-center gap-2 text-xs text-mystic-300/60 bg-mystic-800/50 rounded-full px-4 py-2 border border-mystic-600/30">
                            ✨{" "}
                            {t("freemium.readingsRemaining", {
                                count: readingsLeft,
                            })}
                        </span>
                    )}

                    {/* Generate Wallpaper button */}
                    {wallpaperResults.length === 0 && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGenerateWallpaper}
                            disabled={wallpaperLoading}
                            className="inline-flex items-center gap-2 text-base cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {wallpaperLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    🎨 สร้างวอลเปเปอร์เสริมดวง
                                    <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">10 🪙</span>
                                </>
                            )}
                        </motion.button>
                    )}

                    {/* New Reading button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onNewReading}
                        className="btn-mystic text-base cursor-pointer"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        🔮 {t("cards.newReading")}
                    </motion.button>
                </motion.div>
            )}
        </motion.div>
    );
}
