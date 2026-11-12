
import { fetchCurrencies } from "@/functions/getCurrencyData";
import { useQuery } from "@tanstack/react-query";


export default function useCurrencyList() {
    return useQuery({
        queryKey: ["currencyData"],
        queryFn: () => fetchCurrencies(),
        gcTime: 600,
    });
}
