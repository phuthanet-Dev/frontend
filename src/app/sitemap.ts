import { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articlesData";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://mysticcards.app";

    // Base routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/articles`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-of-use`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    // Dynamic article routes
    const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    return [...routes, ...articleRoutes];
}
