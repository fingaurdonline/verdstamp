export const fetchCurrencies = async () => {
    const res = await fetch("https://coinmarketcapcryptolisting.onrender.com/currency"); // Update with your backend URL
    if (!res.ok) throw new Error("Failed to fetch currency data");
    const data = await res.json();
    return data;
  };