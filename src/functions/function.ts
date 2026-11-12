import { CryptoCurrency } from "@/lib/types";

   export function generateCryptoPairs(cryptoList : CryptoCurrency[]) {
        let pairs = [];
        for (let i = 0; i < cryptoList.length; i++) {
            for (let j = i + 1; j < cryptoList.length; j++) {
                if (cryptoList[i].name === "Tether USDt") {
                    pairs.push(`${cryptoList[j].name}/${cryptoList[i].name}`);
                } else if (cryptoList[j].name === "Tether USDt") {
                    pairs.push(`${cryptoList[i].name}/${cryptoList[j].name}`);
                } else {
                    pairs.push(`${cryptoList[i].name}/${cryptoList[j].name}`);
                    pairs.push(`${cryptoList[j].name}/${cryptoList[i].name}`);
                }
            }
        }
        
        return pairs;
    }



