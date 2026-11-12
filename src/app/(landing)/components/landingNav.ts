/**
 * Shared navigation data for the landing header + mobile menu.
 * Items are grouped to mirror the reference design:
 * Products / About us / Ecosystem / News.
 *
 * Some entries will be trimmed/renamed later — edit them here once.
 */

export type NavLink = {
  title: string;
  description?: string;
  href: string;
};

export type NavGroup = {
  label: string;
  items: NavLink[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Products",
    items: [
      {
        title: "Buy Crypto",
        description: "Buy and sell crypto through institutions",
        href: "/buy-crypto",
      },
      {
        title: "Swap",
        description: "Instantly swap between crypto assets",
        href: "/swap",
      },
      {
        title: "Transfer",
        description: "Send and receive across supported networks",
        href: "/transfer",
      },
      {
        title: "Fees Standard",
        description: "Transparent schedule for every fee",
        href: "/fees-standard",
      },
    ],
  },
  {
    label: "About us",
    items: [
      {
        title: "About Us",
        description: "Who we are and what drives us",
        href: "/about-us",
      },
      {
        title: "Contact Us",
        description: "Reach out to our team anytime",
        href: "/contact-us",
      },
      {
        title: "Proof of Reserve",
        description: "Verify the assets backing the platform",
        href: "/proof-of-reserve",
      },
      {
        title: "Support",
        description: "Answers to all your questions",
        href: "/support",
      },
    ],
  },
  {
    label: "Ecosystem",
    items: [
      {
        title: "Referral",
        description: "Receive up to 40% referral rewards",
        href: "/referral",
      },
      {
        title: "Ambassador",
        description: "Join our global ambassador program",
        href: "/ambassador",
      },
      {
        title: "VIP",
        description: "Exclusive VIP privileges",
        href: "/vip",
      },
      {
        title: "Announcements",
        description: "Latest notices and platform updates",
        href: "/sta-article",
      },
    ],
  },
];

export const NEWS_HREF = "/#news";

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "fa", name: "فارسی" },
  { code: "zh-CN", name: "简体中文" },
  { code: "zh-TW", name: "繁體中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "id", name: "Indonesia" },
  { code: "tr", name: "Türkçe(KKTC)" },
  { code: "ar", name: "العربية" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
];

export const ACCOUNT_LINKS: NavLink[] = [
  { title: "Account Overview", href: "/account" },
  { title: "Security Settings", href: "/account/security-settings" },
  { title: "ID Verification", href: "/account/id-verification" },
  { title: "Preferences", href: "/account/preferences" },
  { title: "Messages", href: "/account/messages" },
  { title: "Voucher Center", href: "/account/voucher-center" },
];

export const ASSET_LINKS: NavLink[] = [
  { title: "Spot", href: "/overview/spot/assets" },
  { title: "Margin", href: "/overview/margin/assets" },
  { title: "Futures", href: "/overview/futures" },
  { title: "Loan", href: "/overview/loan/assets" },
  { title: "History", href: "/overview/history/spot" },
];

export const ORDER_LINKS: NavLink[] = [
  { title: "Spot Orders", href: "/overview/spot/assets" },
  { title: "Futures Orders", href: "/overview/futures" },
  { title: "Swap Orders", href: "/swap" },
];
