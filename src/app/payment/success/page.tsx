"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { fetchCoinBalance } = useAuth();
    const [refreshed, setRefreshed] = useState(false);

    useEffect(() => {
        if (!refreshed) {
            fetchCoinBalance();
            setRefreshed(true);
        }
    }, [fetchCoinBalance, refreshed]);

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-sm bg-space-800 border border-gold-500/30 rounded-2xl p-8 text-center shadow-[0_0_40px_rgba(251,191,36,0.15)]"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
            >
                ✨
            </motion.div>

            <h1 className="text-2xl font-bold text-gold-300 mb-2">ชำระเงินสำเร็จ!</h1>
            <p className="text-mystic-300 text-sm mb-6">
                เหรียญของคุณได้รับการเติมเรียบร้อยแล้ว
                <br />
                สามารถใช้งานได้ทันที
            </p>

            {sessionId && (
                <p className="text-mystic-500 text-xs mb-6 font-mono break-all">
                    Ref: {sessionId}
                </p>
            )}

            <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-space-900 font-bold hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all"
            >
                กลับหน้าหลัก 🏠
            </Link>
        </motion.div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-space-900 px-4">
            <Suspense fallback={<div className="text-mystic-300">กำลังโหลด...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
