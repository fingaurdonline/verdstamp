import { fetchCryptoNews } from "@/functions/getCryptoNews";
import { useQuery } from "@tanstack/react-query";


export default function useCryptoNews() {
    return useQuery({
        queryKey: ["cryptoNews"],
        queryFn: () => fetchCryptoNews(),
        gcTime: 600, 
    });
}