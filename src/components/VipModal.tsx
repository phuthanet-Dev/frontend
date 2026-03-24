import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface VipModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenTopUp: () => void;
}

export default function VipModal({ isOpen, onClose, onOpenTopUp }: VipModalProps) {
    const { user, coinBalance, fetchAuthData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubscribe = async (plan: "WEEKLY" | "MONTHLY", cost: number) => {
        if (!user) return;
        if (coinBalance < cost) {
            onOpenTopUp();
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");
        
        try {
            const token = await user.getIdToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            
            const res = await fetch(`${apiUrl}/api/vip/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ plan })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || "Subscription failed");
            }

            setSuccess(`สมัครสมาชิก VIP แบบ ${plan === "WEEKLY" ? "รายสัปดาห์" : "รายเดือน"} สำเร็จแล้ว!`);
            await fetchAuthData(user); // refresh balance and vip flag
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(10, 10, 26, 0.85)" }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 10 }}
                        className="glass relative w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-mystic-800/50 text-mystic-300 hover:text-white transition-colors z-10"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-6 mt-4">
                            <div className="text-5xl mb-3">✨</div>
                            <h2 className="text-2xl font-bold glow-text font-display mb-2">รับสิทธิ์ VIP ไม่จำกัด</h2>
                            <p className="text-mystic-200/80 text-sm">
                                เลือกแพ็กเกจเพื่อดูดวงไม่อั้น ไม่ต้องหงุดหงิดกับโฆษณา
                            </p>
                            <div className="mt-3 inline-flex px-3 py-1 bg-mystic-800/50 border border-mystic-600/30 rounded-full text-xs text-mystic-300">
                                ยอดเหรียญของคุณ: <span className="text-gold-400 font-bold ml-1">{coinBalance} 🟡</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-center text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-200 text-center text-sm">
                                {success}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {/* Weekly Plan */}
                            <button
                                disabled={isLoading || !!success}
                                onClick={() => handleSubscribe("WEEKLY", 250)}
                                className="relative flex flex-col items-center justify-center p-4 border border-mystic-600/40 rounded-2xl bg-mystic-800/40 hover:bg-mystic-800/80 transition-all text-left group"
                            >
                                <div className="text-lg font-bold text-white mb-1">รายสัปดาห์ (7 วัน)</div>
                                <div className="text-gold-300 font-bold text-lg">250 🟡</div>
                            </button>

                            {/* Monthly Plan */}
                            <button
                                disabled={isLoading || !!success}
                                onClick={() => handleSubscribe("MONTHLY", 600)}
                                className="relative flex flex-col items-center justify-center p-4 border-2 border-gold-500/50 rounded-2xl bg-gold-500/10 hover:bg-gold-500/20 transition-all text-left shadow-[0_0_15px_rgba(251,191,36,0.15)] group"
                            >
                                <div className="absolute -top-3 right-4 bg-gold-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">คุ้มค่าที่สุด</div>
                                <div className="text-lg font-bold text-white mb-1">รายเดือน (30 วัน)</div>
                                <div className="text-gold-300 font-bold text-xl">600 🟡</div>
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={onOpenTopUp}
                                disabled={isLoading}
                                className="text-gold-400/80 hover:text-gold-400 text-sm underline-offset-4 hover:underline transition-all"
                            >
                                เติมเหรียญเพิ่ม
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
