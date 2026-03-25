"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PrivacyPolicy() {
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
                        {t("footer.privacyPolicy")}
                    </h1>
                    
                    <div className="space-y-6 text-mystic-200/90 leading-relaxed text-lg">
                        {isThai ? (
                            <>
                                <p><strong>1. ข้อมูลที่เราเก็บรวบรวม</strong></p>
                                <p>เรารวบรวมข้อมูลส่วนบุคคลที่คุณให้ไว้โดยตรง เช่น ชื่อ และอีเมล เมื่อคุณลงทะเบียนใช้งานหรือเติมเงิน (Coin) รวมถึงข้อมูลคำถามที่คุณใช้ในการดูดวงเพื่อประมวลผลคำทำนาย</p>
                                <p><strong>2. การใช้ข้อมูล</strong></p>
                                <p>ข้อมูลของคุณจะถูกใช้เพื่อให้บริการคำทำนายที่แม่นยำ แจ้งเตือนสถานะบัญชี และปรับปรุงประสบการณ์ใช้งาน เราไม่มีการนำคำถามส่วนตัวของคุณไปขายต่อหรือเผยแพร่สู่สาธารณะ</p>
                                <p><strong>3. การรักษาความปลอดภัย</strong></p>
                                <p>เราใช้มาตรการรักษาความปลอดภัยตามมาตรฐานอุตสาหกรรม การชำระเงินทั้งหมดดำเนินการผ่านระบบ Stripe ซึ่งเข้ารหัสข้อมูลของคุณอย่างปลอดภัยและเราไม่เคยเก็บข้อมูลบัตรเครดิตคุณไว้ในเซิร์ฟเวอร์ของเรา</p>
                            </>
                        ) : (
                            <>
                                <p><strong>1. Information We Collect</strong></p>
                                <p>We collect personal information you provide directly to us, such as your name and email address when you create an account or purchase Coins. We also process the questions you submit for your readings.</p>
                                <p><strong>2. How We Use Your Information</strong></p>
                                <p>Your information is used to provide accurate reading services, manage your account, and improve your user experience. We never sell or publicly distribute your personal questions or reading results.</p>
                                <p><strong>3. Data Security</strong></p>
                                <p>We implement industry-standard security measures to protect your data. All payments are securely processed by Stripe, and we do not store your credit card information on our servers.</p>
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
