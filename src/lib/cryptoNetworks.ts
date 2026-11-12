

export type CryptoNetwork = {
  name: string;
  type?: string;
  symbol?: string;
  token_standard: string;
  contract_address?: string;
};

export type CryptoNetworks = {
  [key: string]: {
    networks: CryptoNetwork[];
  };
};

export const cryptoNetworks: CryptoNetworks = {
  bitcoin: {
    networks: [
      {
        name: "Bitcoin",
        type: "Mainnet",
        symbol: "BTC",
        token_standard: "",
        contract_address: "",
      },
    ],
  },
  ethereum: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "ETH",
        token_standard: "ERC-20",
        contract_address: "",
      },
    ],
  },
  "tether usdt": {
    networks: [
      { name: "Ethereum", token_standard: "ERC-20", contract_address: "" },
      {
        name: "Tron",
        token_standard: "TRC-20",
        contract_address: "TWe4sZUd4kYj3xENv1UhgWKMK1XK6ZowYc",
      },
      {
        name: "Binance Smart Chain",
        token_standard: "BEP-20",
        contract_address: "0x1924e1f0db0d1711831a1a6b90e96c3be0cd5c65",
      },
      {
        name: "Polygon",
        token_standard: "ERC-20",
        contract_address: "0x13860bc00cced338ecb27e2a62177e531e317b3f",
      },
    ],
  },
  usdc: {
    networks: [
      {
        name: "Ethereum",
        token_standard: "ERC-20",
        contract_address: "0xf9428cbb5f306e245e93302ae2497a091144e30e",
      },
      {
        name: "Tron",
        token_standard: "TRC-20",
        contract_address: "TMoCvTnCNFwR7qszjf5CKpP5W2ZDkPXw7f",
      },
      {
        name: "Binance Smart Chain",
        token_standard: "BEP-20",
        contract_address: "0x53c5046b717116f0703241d715749cc409219e89",
      },
      {
        name: "Polygon",
        token_standard: "ERC-20",
        contract_address: "0x9cddc21d01f325c41e1b4e3e1dd77f674c52cd3b",
      },
      { name: "Polkadot", token_standard: "AssetHub", contract_address: "_" },
    ],
  },
  xrp: {
    networks: [
      {
        name: "XRP Ledger",
        type: "Mainnet",
        symbol: "XRP",
        token_standard: "",
        contract_address: "",
      },
    ],
  },
  bnb: {
    networks: [
      {
        name: "BNB Smart Chain",
        type: "Mainnet",
        symbol: "BNB",
        token_standard: "BEP-20",
        contract_address: "",
      },
      {
        name: "BNB Beacon Chain",
        type: "Mainnet",
        symbol: "BNB",
        token_standard: "BEP-2",
        contract_address: "-",
      },
    ],
  },
  solana: {
    networks: [
      {
        name: "Solana",
        type: "Mainnet",
        symbol: "SOL",
        token_standard: "SPL",
        contract_address: "",
      },
    ],
  },
  tron: {
    networks: [
      {
        name: "Tron",
        type: "Mainnet",
        symbol: "TRX",
        token_standard: "TRC-20",
        contract_address: "",
      },
    ],
  },
  litecoin: {
    networks: [
      {
        name: "Litecoin",
        type: "Mainnet",
        symbol: "LTC",
        token_standard: "",
        contract_address: "",
      },
    ],
  },
  "bitcoin cash": {
    networks: [
      {
        name: "Bitcoin Cash",
        type: "Mainnet",
        symbol: "BCH",
        token_standard: "",
        contract_address: "",
      },
    ],
  },
  uniswap: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "UNI",
        token_standard: "ERC-20",
        contract_address: "0x832a5249d6379efc8baf72dcdcb90c8e6e7768f1",
      },
      {
        name: "Polygon",
        type: "Sidechain",
        symbol: "UNI",
        token_standard: "ERC-20",
        contract_address: "0x7a25d8b8f1ecff58a4e0c2d3580fd011f6a9fd38",
      },
      {
        name: "Arbitrum",
        type: "Layer 2",
        symbol: "UNI",
        token_standard: "ERC-20",
        contract_address: "-",
      },
      {
        name: "Optimism",
        type: "Layer 2",
        symbol: "UNI",
        token_standard: "ERC-20",
        contract_address: "-",
      },
    ],
  },
  polkadot: {
    networks: [
      {
        name: "Polkadot",
        type: "Mainnet",
        symbol: "DOT",
        token_standard: "",
        contract_address: "",
      },
    ],
  },
  avalanche: {
    networks: [
      {
        name: "Avalanche C-Chain",
        type: "EVM",
        symbol: "AVAX",
        token_standard: "ERC-20",
        contract_address: "0x681ecf39d39f7e8b01b7cebf290c62461a1a89e9 ",
      },
      {
        name: "Avalanche X-Chain",
        type: "Mainnet",
        symbol: "AVAX",
        token_standard: "AVM",
        contract_address: "-",
      },
    ],
  },
  dogecoin: {
    networks: [
      {
        name: "Dogecoin",
        type: "Mainnet",
        symbol: "DOGE",
        token_standard: "",
        contract_address: "",
      },
    ],
  },
  "shiba inu": {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "SHIB",
        token_standard: "ERC-20",
        contract_address: "0x90425747f5e99e9c9cece3ebda7296b462ba6f61 ",
      },
      {
        name: "Shibarium",
        type: "Layer 2",
        symbol: "SHIB",
        token_standard: "Shibarium Token",
        contract_address: "-",
      },
    ],
  },
  stellar: {
    networks: [
      {
        name: "Stellar",
        type: "Mainnet",
        symbol: "XLM",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  toncoin: {
    networks: [
      {
        name: "The Open Network (TON)",
        type: "Mainnet",
        symbol: "TON",
        token_standard: "Jetton",
        contract_address: "",
      },
    ],
  },
  "leo token": {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "LEO",
        token_standard: "ERC-20",
        contract_address: "-",
      },
      {
        name: "EOS",
        type: "Mainnet",
        symbol: "LEO",
        token_standard: "EOSIO",
        contract_address: "-",
      },
    ],
  },
  "internet computer": {
    networks: [
      {
        name: "Internet Computer",
        type: "Mainnet",
        symbol: "ICP",
        token_standard: "ICRC-1",
        contract_address: "-",
      },
    ],
  },
  "ethereum classic": {
    networks: [
      {
        name: "Ethereum Classic",
        type: "Mainnet",
        symbol: "ETC",
        token_standard: "",
        contract_address: "",
      },
    ],
  },
  filecoin: {
    networks: [
      {
        name: "Filecoin",
        type: "Mainnet",
        symbol: "FIL",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  "near protocol": {
    networks: [
      {
        name: "NEAR Protocol",
        type: "Mainnet",
        symbol: "NEAR",
        token_standard: "NEP-141",
        contract_address: "-",
      },
    ],
  },
  vechain: {
    networks: [
      {
        name: "VeChainThor",
        type: "Mainnet",
        symbol: "VET",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  aptos: {
    networks: [
      {
        name: "Aptos",
        type: "Mainnet",
        symbol: "APT",
        token_standard: "APT",
        contract_address: "-",
      },
    ],
  },
  hedera: {
    networks: [
      {
        name: "Hedera",
        type: "Mainnet",
        symbol: "HBAR",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  arbitrum: {
    networks: [
      {
        name: "Arbitrum",
        type: "Layer 2",
        symbol: "ARB",
        token_standard: "ERC-20",
        contract_address: "0xc8f3f1c1e89f42a0acff36f98a35abcb1577c913",
      },
    ],
  },
  cronos: {
    networks: [
      {
        name: "Cronos",
        type: "Mainnet",
        symbol: "CRO",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  quant: {
    networks: [
      {
        name: "Quant Network",
        type: "Mainnet",
        symbol: "QNT",
        token_standard: "QRC-20",
        contract_address: "-",
      },
    ],
  },
  "the graph": {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "GRT",
        token_standard: "ERC-20",
        contract_address: "0xaba3ecda6d9a2ed9bb45ff4cbe34952cf5f9d56a",
      },
    ],
  },
  algorand: {
    networks: [
      {
        name: "Algorand",
        type: "Mainnet",
        symbol: "ALGO",
        token_standard: "ASA",
        contract_address: "-",
      },
    ],
  },
  eos: {
    networks: [
      {
        name: "EOS",
        type: "Mainnet",
        symbol: "EOS",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  stacks: {
    networks: [
      {
        name: "Stacks",
        type: "Mainnet",
        symbol: "STX",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  multiversx: {
    networks: [
      {
        name: "MultiversX",
        type: "Mainnet",
        symbol: "EGLD",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  fantom: {
    networks: [
      {
        name: "Fantom",
        type: "Mainnet",
        symbol: "FTM",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  decentraland: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "MANA",
        token_standard: "ERC-20",
        contract_address: "0x29ed3c1b7c8a94d04e598f0ff2e31350d6e58c82",
      },
    ],
  },
  "the sandbox": {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "SAND",
        token_standard: "ERC-20",
        contract_address: "0x60c5d7fc7cd7f24938f9b7505c69fd64d6834c60 ",
      },
    ],
  },
  tezos: {
    networks: [
      {
        name: "Tezos",
        type: "Mainnet",
        symbol: "XTZ",
        token_standard: "FA1.2/FA2",
        contract_address: "-",
      },
    ],
  },
  "axie infinity": {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "AXS",
        token_standard: "ERC-20",
        contract_address: "0xa23bfa1c3f6bc1b51571e93827a7e05e53c57f13",
      },
      {
        name: "Ronin",
        type: "Sidechain",
        symbol: "AXS",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  "theta network": {
    networks: [
      {
        name: "Theta",
        type: "Mainnet",
        symbol: "THETA",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  aave: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "AAVE",
        token_standard: "ERC-20",
        contract_address: "0x37c64ab2e2344c8e4b4a882ddf18e612e3e8c491",
      },
    ],
  },
  kava: {
    networks: [
      {
        name: "Kava",
        type: "Mainnet",
        symbol: "KAVA",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  chiliz: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "CHZ",
        token_standard: "ERC-20",
        contract_address: "-",
      },
    ],
  },
  pancakeswap: {
    networks: [
      {
        name: "BNB Smart Chain",
        type: "Mainnet",
        symbol: "CAKE",
        token_standard: "BEP-20",
        contract_address: "0x7d2a14c0e5b9b18490c1b24ad40fc2e9a058b630",
      },
    ],
  },
  maker: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "MKR",
        token_standard: "ERC-20",
        contract_address: "-",
      },
    ],
  },
  synthetix: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "SNX",
        token_standard: "ERC-20",
        contract_address: "-",
      },
    ],
  },
  zcash: {
    networks: [
      {
        name: "Zcash",
        type: "Mainnet",
        symbol: "ZEC",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  dash: {
    networks: [
      {
        name: "Dash",
        type: "Mainnet",
        symbol: "DASH",
        token_standard: "",
        contract_address: "",
      },
    ],
  },
  dent: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "DENT",
        token_standard: "ERC-20",
        contract_address: "0x6d9f51b8a8b33f987a1cc169b939b86753b5b5a5",
      },
    ],
  },
  status: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "SNT",
        token_standard: "ERC-20",
        contract_address: "-",
      },
    ],
  },
  "fetch ai": {
    networks: [
      {
        name: "Fetch.ai",
        type: "Mainnet",
        symbol: "FET",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  numeraire: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "NMR",
        token_standard: "ERC-20",
        contract_address: "-",
      },
    ],
  },
  augur: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "REP",
        token_standard: "ERC-20",
        contract_address: "-",
      },
    ],
  },
  "power ledger": {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "POWR",
        token_standard: "ERC-20",
        contract_address: "-",
      },
      {
        name: "Solana",
        type: "Mainnet",
        symbol: "POWR",
        token_standard: "SPL",
        contract_address: "7Gm9u3ZmjMUBYY2KxX3CZTqjXdD5Y8WFiLbZDcYXm1sz",
      },
    ],
  },
  "iexec rlc": {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "RLC",
        token_standard: "ERC-20",
        contract_address: "-",
      },
    ],
  },
  cortex: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "CTXC",
        token_standard: "ERC-20",
        contract_address: "-",
      },
    ],
  },
  singularitynet: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "AGIX",
        token_standard: "ERC-20",
        contract_address: "-",
      },
    ],
  },
  bluzelle: {
    networks: [
      {
        name: "Ethereum",
        type: "Mainnet",
        symbol: "BLZ",
        token_standard: "ERC-20",
        contract_address: "-",
      },
    ],
  },
  verge: {
    networks: [
      {
        name: "Verge",
        type: "Mainnet",
        symbol: "XVG",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  syscoin: {
    networks: [
      {
        name: "Syscoin",
        type: "Mainnet",
        symbol: "SYS",
        token_standard: "SPT",
        contract_address: "-",
      },
    ],
  },
  velas: {
    networks: [
      {
        name: "Velas",
        type: "Mainnet",
        symbol: "VLX",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  digibyte: {
    networks: [
      {
        name: "DigiByte",
        type: "Mainnet",
        symbol: "DGB",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  komodo: {
    networks: [
      {
        name: "Komodo",
        type: "Mainnet",
        symbol: "KMD",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  ark: {
    networks: [
      {
        name: "ARK",
        type: "Mainnet",
        symbol: "ARK",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  electroneum: {
    networks: [
      {
        name: "Electroneum",
        type: "Mainnet",
        symbol: "ETN",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  nexus: {
    networks: [
      {
        name: "Nexus",
        type: "Mainnet",
        symbol: "NXS",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  bytecoin: {
    networks: [
      {
        name: "Bytecoin",
        type: "Mainnet",
        symbol: "BCN",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  monacoin: {
    networks: [
      {
        name: "Monacoin",
        type: "Mainnet",
        symbol: "MONA",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  feathercoin: {
    networks: [
      {
        name: "Feathercoin",
        type: "Mainnet",
        symbol: "FTC",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  namecoin: {
    networks: [
      {
        name: "Namecoin",
        type: "Mainnet",
        symbol: "NMC",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  terracoin: {
    networks: [
      {
        name: "Terracoin",
        type: "Mainnet",
        symbol: "TRC",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  peercoin: {
    networks: [
      {
        name: "Peercoin",
        type: "Mainnet",
        symbol: "PPC",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  primecoin: {
    networks: [
      {
        name: "Primecoin",
        type: "Mainnet",
        symbol: "XPM",
        token_standard: "",
        contract_address: "-",
      },
    ],
  },
  cosmos: {
    networks: [
      {
        name: "Cosmos Hub",
        type: "Mainnet",
        symbol: "ATOM",
        token_standard: "",
        contract_address: "",
      },
    ],
  },
};

export default cryptoNetworks;
