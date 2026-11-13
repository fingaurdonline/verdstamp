import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const routes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/buy-crypto", changeFrequency: "weekly", priority: 0.9 },
  { path: "/swap", changeFrequency: "weekly", priority: 0.9 },
  { path: "/transfer", changeFrequency: "weekly", priority: 0.9 },
  { path: "/proof-of-reserve", changeFrequency: "monthly", priority: 0.8 },
  { path: "/referral", changeFrequency: "weekly", priority: 0.8 },
  { path: "/vip", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fees-standard", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/support", changeFrequency: "weekly", priority: 0.7 },
  { path: "/ambassador", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact-us", changeFrequency: "yearly", priority: 0.6 },
  { path: "/service", changeFrequency: "yearly", priority: 0.5 },
  { path: "/sta-article", changeFrequency: "weekly", priority: 0.5 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/law-enforcement", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(route => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
