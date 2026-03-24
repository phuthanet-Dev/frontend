"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ErrorPopup from "./ErrorPopup";

interface CoinTopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TOPUP_OPTIONS = [
    { amount: 100, priceThb: 19 },
    { amount: 500, priceThb: 89, popular: true },
    { amount: 1200, priceThb: 199 },
];

export default function CoinTopUpModal({ isOpen, onClose }: CoinTopUpModalProps) {
    const t = useTranslations();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const handleClose = () => {
        if (!isProcessing) {
            setError("");
            onClose();
        }
    };

    const handleSelectAmount = async (coins: number) => {
        if (!user) {
            setError("กรุณาเข้าสู่ระบบก่อนใช้งาน");
            return;
        }
        setIsProcessing(true);
        setError("");

        try {
            const token = await user.getIdToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

            const res = await fetch(`${apiUrl}/api/stripe/create-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ coins }),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || "ไม่สามารถสร้าง session การชำระเงินได้");
            }

            const data = await res.json();
            window.location.href = data.sessionUrl;

        } catch (err: any) {
            console.error("Stripe session error:", err);
            setError(err.message || "ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง");
            setIsProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-space-900/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-space-800 border-2 border-gold-500/30 rounded-2xl p-6 shadow-glow-gold overflow-hidden"
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-[50px] rounded-full pointer-events-none" />

                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-gold-300 via-gold-100 to-gold-300 bg-clip-text text-transparent">
                                {t("coin.topup")}
                            </h2>
                            <p className="text-mystic-300 text-sm mt-2">
                                ปลดล็อคคำตอบที่คุณต้องการด้วยเหรียญวิเศษ
                            </p>
                            <p className="text-mystic-400/70 text-xs mt-1">
                                ชำระผ่าน PromptPay (สแกน QR บน Stripe)
                            </p>
                        </div>

                        <ErrorPopup
                            isOpen={!!error}
                            message={error}
                            onClose={() => setError("")}
                        />

                        <div className="grid gap-4">
                            {TOPUP_OPTIONS.map((option) => (
                                <motion.button
                                    key={option.amount}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isProcessing}
                                    onClick={() => handleSelectAmount(option.amount)}
                                    className={`relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${option.popular
                                        ? "bg-gold-500/10 border-gold-400"
                                        : "bg-mystic-900/50 border-mystic-500/30 hover:border-gold-500/50"
                                        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {option.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-space-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Popular
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center text-space-900 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                                            <span className="font-bold text-lg">💰</span>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xl font-bold text-mystic-100">
                                                {option.amount}
                                            </div>
                                            <div className="text-xs text-mystic-400">
                                                {t("coin.balance")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gold-300">
                                            ฿{option.priceThb}
                                        </div>
                                        {isProcessing ? null : (
                                            <div className="text-xs text-mystic-400">กดเพื่อชำระ</div>
                                        )}
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {isProcessing && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-mystic-300">
                                <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                                กำลังเปิดหน้าชำระเงิน...
                            </div>
                        )}

                        {!isProcessing && (
                            <button
                                onClick={handleClose}
                                className="mt-6 w-full py-2 text-mystic-400 hover:text-mystic-200 text-sm transition-colors"
                            >
                                {t("freemium.close")}
                            </button>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
