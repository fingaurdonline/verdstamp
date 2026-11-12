
import { fetchCurrencies } from "@/functions/getCurrencyData";
import { useQuery } from "@tanstack/react-query";


export default function useCurrencies() {
    return useQuery({
        queryKey: ["currencies"],
        queryFn: () => fetchCurrencies(),
        gcTime: 600, 
    });
}