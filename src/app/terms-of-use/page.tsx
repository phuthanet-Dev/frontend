"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function TermsOfUse() {
    const locale = useLocale();
    const t = useTranslations();
    const isThai = locale === "th";

    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar 
                currentLocale={locale} 
                onLocaleChange={(newLocale) => { 
                    document.cookie = `MYSTIC_LOCALE=${newLocale}; path=/; max-age=31536000`; 
                    window.location.reload(); 
                }} 
                onOpenAuthModal={() => { window.location.href = "/"; }} 
            />
            <main className="flex-1 py-16 px-6 max-w-4xl mx-auto w-full">
                <article className="glass-card p-8 md:p-12 rounded-3xl border border-mystic-600/30">
                    <h1 className="text-3xl md:text-5xl font-black mb-10 text-mystic-100 leading-tight">
                        {t("footer.termsOfUse")}
                    </h1>
                    
                    <div className="space-y-6 text-mystic-200/90 leading-relaxed text-lg">
                        {isThai ? (
                            <>
                                <p><strong>1. ข้อกำหนดการใช้งานทั่วไป</strong></p>
                                <p>เว็บไซต์ Mystic Cards จัดทำขึ้นเพื่อ "ความบันเทิง" เท่านั้น คำทำนายที่ได้จากแอปพลิเคชันไม่ควรนำไปใช้แทนคำแนะนำของผู้เชี่ยวชาญทางการแพทย์ การเงิน และกฎหมายในทุกกรณี</p>
                                <p><strong>2. นโยบายการใช้เหรียญ (Coins)</strong></p>
                                <p>เหรียญที่ถูกซื้อผ่านระบบไม่สามารถแลกเปลี่ยนคืนเป็นเงินสดได้ เหรียญทั้งหมดจะถูกผูกมัดกับบัญชีที่คุณใช้สั่งซื้อ</p>
                                <p><strong>3. การรับประกันผลลัพธ์</strong></p>
                                <p>ระบบให้บริการทำนายโดยใช้ปัญญาประดิษฐ์ (AI) ซึ่งผลลัพธ์อาจมีความคลาดเคลื่อน หรือไม่ตรงกับเหตุการณ์จริง เราขอสงวนสิทธิ์ในการรับผิดชอบต่อการตัดสินใจใดๆ ที่เกิดจากการอ้างอิงเนื้อหาบนเว็บไซต์</p>
                            </>
                        ) : (
                            <>
                                <p><strong>1. General Terms</strong></p>
                                <p>The Mystic Cards website is intended strictly for "entertainment purposes". Under no circumstance should the readings or AI interpretations replace professional medical, financial, or legal advice.</p>
                                <p><strong>2. Coins Policy</strong></p>
                                <p>Coins purchased within the application are non-refundable and hold no real-world cash value. All coins are exclusively bound to the account used during purchase.</p>
                                <p><strong>3. No Guarantee of Results</strong></p>
                                <p>Our readings are artificial intelligence driven and might be inaccurate or purely imaginative. We disclaim any liability for decisions made or actions taken based on the content of this website.</p>
                            </>
                        )}
                    </div>
                </article>
            </main>

            <footer className="py-6 text-center border-t border-mystic-600/30 w-full mt-auto">
                <p className="text-mystic-300/40 text-xs mb-3 max-w-2xl mx-auto px-4">
                    {t("footer.disclaimer") || "Mystic Cards is for entertainment purposes only."}
                </p>
                <div className="flex justify-center flex-wrap gap-4 mt-2">
                    <Link href="/privacy-policy" className="text-mystic-300/40 hover:text-mystic-300 transition-colors text-xs">{t("footer.privacyPolicy") || "Privacy Policy"}</Link>
                    <p className="text-mystic-300/40 text-xs">
                        {t("footer.copyright") || "© 2026 Mystic Cards. All rights reserved."}
                    </p>
                    <Link href="/terms-of-use" className="text-mystic-300/40 hover:text-mystic-300 transition-colors text-xs">{t("footer.termsOfUse") || "Terms of Use"}</Link>
                </div>
            </footer>
        </div>
    );
}
