import { motion, AnimatePresence } from "framer-motion";

interface ErrorPopupProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

export default function ErrorPopup({ isOpen, message, onClose }: ErrorPopupProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-space-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 10 }}
                        className="relative w-full max-w-xs bg-[#11131f] border-2 border-red-500/80 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.8),_0_0_30px_rgba(239,68,68,0.3)] z-50"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-mystic-100 mb-2">ทำรายการไม่สำเร็จ</h3>
                            <p className="text-mystic-300 text-sm mb-6 break-words">{message === "Failed to fetch" ? "ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง" : message}</p>
                            
                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-bold border border-red-500/30 hover:bg-red-500/20 transition-colors"
                            >
                                ตกลง
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
