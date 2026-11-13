import { Img } from "@react-email/components";
import { SITE_URL } from "@/lib/site";

/**
 * Email-safe Verdstamp wordmark. Email clients cannot use the app's CSS theme,
 * so transactional emails always use the light-background wordmark.
 */
export default function Logo({ className }: { className?: string }) {
    return (
        <Img
            src={`${SITE_URL}/brand/verdstamp-wordmark-light.png`}
            alt="Verdstamp"
            width={180}
            height={35}
            className={className}
        />
    );
}
