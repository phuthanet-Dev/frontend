"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-space-900 px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-sm bg-space-800 border border-mystic-500/30 rounded-2xl p-8 text-center"
            >
                <div className="text-6xl mb-4">🌙</div>

                <h1 className="text-2xl font-bold text-mystic-200 mb-2">ยกเลิกการชำระเงิน</h1>
                <p className="text-mystic-400 text-sm mb-8">
                    คุณได้ยกเลิกการทำรายการแล้ว
                    <br />
                    เหรียญของคุณยังคงเดิม ไม่มีการหักเงิน
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-space-900 font-bold hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all"
                    >
                        กลับหน้าหลัก
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
