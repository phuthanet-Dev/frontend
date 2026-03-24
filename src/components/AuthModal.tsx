"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const t = useTranslations("auth");
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setEmail("");
        setPassword("");
        setError(null);
        setIsLogin(true); // Optional: reset to login view
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
            }
            onClose();
        } catch (err: any) {
            console.error("Auth error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError(t("emailAlreadyInUse"));
            } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError(t("invalidCredential"));
            } else {
                setError(err.message || "Authentication failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        try {
            await signInWithGoogle();
            handleClose();
        } catch (err: any) {
            setError(err.message || "Google sign-in failed");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-mystic-900/80 backdrop-blur-sm z-50 flex justify-center items-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-dark w-full max-w-md rounded-2xl p-6 md:p-8 relative border border-gold-500/30 glow-purple"
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-mystic-300 hover:text-gold-300 transition-colors"
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl font-bold text-center mb-6 glow-text text-gold-300">
                                {isLogin ? t("signInTitle") : t("signUpTitle")}
                            </h2>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs text-mystic-300 mb-1 ml-1 uppercase tracking-wider">
                                        {t("email")}
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-mystic-800/50 border border-mystic-500 rounded-xl px-4 py-3 text-mystic-100 placeholder-mystic-500 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-mystic-300 mb-1 ml-1 uppercase tracking-wider">
                                        {t("password")}
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-mystic-800/50 border border-mystic-500 rounded-xl px-4 py-3 text-mystic-100 placeholder-mystic-500 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {error && (
                                    <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-lg border border-red-500/30">
                                        {error}
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    type="submit"
                                    className="btn-mystic w-full py-3 mt-2 disabled:opacity-70"
                                >
                                    {loading ? "..." : isLogin ? t("signInBtn") : t("signUpBtn")}
                                </motion.button>
                            </form>

                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-mystic-600"></div>
                                <span className="text-mystic-400 text-xs uppercase tracking-wider">{t("or")}</span>
                                <div className="flex-1 h-px bg-mystic-600"></div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGoogleSignIn}
                                type="button"
                                className="w-full bg-white text-gray-800 font-semibold py-3 px-4 outline-none rounded-xl flex items-center justify-center gap-3 transition-colors hover:bg-gray-100 shadow-lg"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                {t("continueWithGoogle")}
                            </motion.button>

                            <div className="mt-8 text-center text-sm text-mystic-300">
                                {isLogin ? t("noAccount") + " " : t("hasAccount") + " "}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError(null);
                                    }}
                                    className="text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4"
                                >
                                    {isLogin ? t("signUpLink") : t("signInLink")}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
