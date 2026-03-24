"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ProfileData) => Promise<void>;
}

export interface ProfileData {
    firstName: string;
    lastName: string;
    birthDate: string;
    birthTime: string;
    zodiac: string;
    element: string;
}

const ZODIACS = [
    { value: "Aries", label: "ราศีเมษ (Aries)" },
    { value: "Taurus", label: "ราศีพฤษภ (Taurus)" },
    { value: "Gemini", label: "ราศีเมถุน (Gemini)" },
    { value: "Cancer", label: "ราศีกรกฎ (Cancer)" },
    { value: "Leo", label: "ราศีสิงห์ (Leo)" },
    { value: "Virgo", label: "ราศีกันย์ (Virgo)" },
    { value: "Libra", label: "ราศีตุลย์ (Libra)" },
    { value: "Scorpio", label: "ราศีพิจิก (Scorpio)" },
    { value: "Sagittarius", label: "ราศีธนู (Sagittarius)" },
    { value: "Capricorn", label: "ราศีมังกร (Capricorn)" },
    { value: "Aquarius", label: "ราศีกุมภ์ (Aquarius)" },
    { value: "Pisces", label: "ราศีมีน (Pisces)" }
];

const ELEMENTS = [
    { value: "Fire", label: "ธาตุไฟ (Fire)" },
    { value: "Earth", label: "ธาตุดิน (Earth)" },
    { value: "Air", label: "ธาตุลม (Air)" },
    { value: "Water", label: "ธาตุน้ำ (Water)" }
];

export default function ProfileModal({ isOpen, onClose, onSubmit }: ProfileModalProps) {
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ProfileData>({
        firstName: "",
        lastName: "",
        birthDate: "",
        birthTime: "",
        zodiac: "Aries",
        element: "Fire",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await onSubmit(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-mystic-900/80 backdrop-blur-md z-[60] flex justify-center items-center p-4 overflow-y-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="glass-dark w-full max-w-lg rounded-3xl p-6 md:p-10 relative border border-gold-500/30 glow-gold my-8"
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="text-4xl mb-4">✨</div>
                            <h2 className="text-2xl md:text-3xl font-bold glow-text text-gold-300" style={{ fontFamily: "var(--font-display)" }}>
                                {t("auth.welcomeTitle") || "Welcome to Mystic Cards"}
                            </h2>
                            <p className="text-mystic-300 text-sm mt-2">
                                {t("auth.profileSubtitle") || "Please complete your destiny profile to get accurate readings."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Name Row */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs text-gold-400/80 mb-1.5 ml-1 uppercase tracking-wider font-semibold">
                                        ชื่อ *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full bg-mystic-800/60 border border-mystic-500/50 rounded-xl px-4 py-3 text-mystic-100 placeholder-mystic-500/50 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all"
                                        placeholder="ชื่อจริง"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-gold-400/80 mb-1.5 ml-1 uppercase tracking-wider font-semibold">
                                        นามสกุล *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full bg-mystic-800/60 border border-mystic-500/50 rounded-xl px-4 py-3 text-mystic-100 placeholder-mystic-500/50 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all"
                                        placeholder="นามสกุล"
                                    />
                                </div>
                            </div>

                            {/* Birthday Row */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs text-gold-400/80 mb-1.5 ml-1 uppercase tracking-wider font-semibold">
                                        วันเกิด *
                                    </label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        required
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full bg-mystic-800/60 border border-mystic-500/50 rounded-xl px-4 py-3 text-mystic-100 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all [color-scheme:dark]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-gold-400/80 mb-1.5 ml-1 uppercase tracking-wider font-semibold">
                                        เวลาเกิด (ถ้าทราบ)
                                    </label>
                                    <input
                                        type="time"
                                        name="birthTime"
                                        value={formData.birthTime}
                                        onChange={handleChange}
                                        className="w-full bg-mystic-800/60 border border-mystic-500/50 rounded-xl px-4 py-3 text-mystic-100 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Zodiac & Element Row */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs text-gold-400/80 mb-1.5 ml-1 uppercase tracking-wider font-semibold">
                                        ราศี
                                    </label>
                                    <select
                                        name="zodiac"
                                        value={formData.zodiac}
                                        onChange={handleChange}
                                        className="w-full bg-mystic-800/60 border border-mystic-500/50 rounded-xl px-4 py-3 text-mystic-100 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all"
                                    >
                                        {ZODIACS.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-gold-400/80 mb-1.5 ml-1 uppercase tracking-wider font-semibold">
                                        ธาตุ
                                    </label>
                                    <select
                                        name="element"
                                        value={formData.element}
                                        onChange={handleChange}
                                        className="w-full bg-mystic-800/60 border border-mystic-500/50 rounded-xl px-4 py-3 text-mystic-100 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all"
                                    >
                                        {ELEMENTS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-900/20 py-3 rounded-xl border border-red-500/30">
                                    {error}
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                type="submit"
                                className="btn-mystic w-full py-4 mt-4 text-lg shadow-[0_0_20px_rgba(212,168,73,0.3)] disabled:opacity-70 flex justify-center items-center gap-2 font-bold"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-mystic-900 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        เริ่มเปิดดวงชะตา <span className="text-xl">🔮</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
