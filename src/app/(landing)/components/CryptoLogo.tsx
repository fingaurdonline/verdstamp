import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BiSolidCoinStack } from "react-icons/bi";

type CryptoLogoProps = {
    url: string;
    alt: string;
}

export default function CryptoLogo({ url, alt }: CryptoLogoProps) {
    return (
        <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={url} alt={alt} className="h-8 w-8 rounded-full" />
            <AvatarFallback className="flex h-8 w-8 items-center justify-center rounded-full bg-lnd-surface-2">
                <BiSolidCoinStack className="h-4 w-4 text-lnd-accent" />
            </AvatarFallback>
        </Avatar>
    )
}
