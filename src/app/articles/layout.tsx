import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Articles & Card Reference Guides",
    description: "ศูนย์รวมคู่มือการอ่านไพ่ ความหมายไพ่ทาโรต์ ไพ่เลอนอร์ม็องแต่ละใบ และเทคนิคการพยากรณ์ชะตาชีวิต Tarot and Cartomancy extensive guides.",
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
