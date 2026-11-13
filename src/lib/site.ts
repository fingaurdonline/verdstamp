/**
 * Shared, client-safe site constants.
 *
 * NEXT_PUBLIC_SITE_URL is optional. The production apex is the canonical
 * origin when it is not set, so links generated in the browser stay correct.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://verdstampdigital.app"
).replace(/\/+$/, "");

export const SITE_NAME = "Verdstamp";
export const SITE_TAGLINE = "Trusted Markets";
export const SITE_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const SITE_DESCRIPTION =
  "Buy, swap, transfer and trade digital assets with transparent fees, deep liquidity and 24/7 support.";

export const SUPPORT_EMAIL = "support@verdstampdigital.app";
export const TEAM_EMAIL = "team@verdstampdigital.app";
export const COMPLIANCE_EMAIL = "compliance@verdstampdigital.app";
export const OG_IMAGE_PATH = "/brand/verdstamp-og.png";
