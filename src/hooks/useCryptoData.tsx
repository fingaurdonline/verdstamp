// app/components/CryptoList.tsx
import { fetchCryptoData } from "@/functions/getCryptoData";
import { useQuery } from "@tanstack/react-query";


export default function useCryptoList() {
    return useQuery({
        queryKey: ["cryptoData"],
        queryFn: () => fetchCryptoData(),
        gcTime: 600,
    });
}
