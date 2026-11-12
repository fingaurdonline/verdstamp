export const fetchCryptoData = async () => {
    const res = await fetch("https://coinmarketcapcryptolisting.onrender.com/crypto"); // Update with your backend URL
    if (!res.ok) throw new Error("Failed to fetch crypto data");
    const data = await res.json();
    return data;
  };