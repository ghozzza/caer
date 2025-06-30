import { Token } from "@/types/type";

export const tokens: Token[] = [
  {
    name: "WETH",
    symbol: "WETH",
    logo: "/token/weth.png",
    decimals: 18,
    addresses: {
      11155111: "0x89d3acb10fc9f9bee444c05e1363e514e8a748da",
      43113: "0x63CFd5c58332c38d89B231feDB5922f5817DF180",
      421614: "0x07b1f448c3697d7379cd5fb1e57c898b5cef97cc",
      84532: "0x2769a1ce97cc2d21e3723ee986b29173de3fe4ac",
    },
    priceFeed: "0x86d67c3D38D2bCeE722E601025C25a575021c6EA",
  },
  {
    name: "WBTC",
    symbol: "WBTC",
    logo: "/token/wbtc.png",
    decimals: 8,
    addresses: {
      11155111: "0xbe4d4858eb0849b038a0b5ecd38a7599d73bd923",
      43113: "0xa7A93C5F0691a5582BAB12C0dE7081C499aECE7f",
      421614: "0xc0f3bbe559e78f2bcebbb588bb561c3030a00eeb",
      84532: "0x548c22d340eb79915316f01e45b4133203a24e90",
    },
    priceFeed: "0x31CF013A08c6Ac228C94551d535d5BAfE19c602a",
  },
  {
    name: "WAVAX",
    symbol: "WAVAX",
    logo: "/token/wavax.png",
    decimals: 18,
    addresses: {
      11155111: "0x4314bb3ad93206ee8f7f18dbcc49943366503bbf",
      43113: "0xA61Eb0D33B5d69DC0D0CE25058785796296b1FBd",
      421614: "0x0fe5fa3fb5e8815e66eeb50758f7a74d732445d9",
      84532: "0x322b3326b5f7de4abd7554f6a32217825770fd41",
    },
    priceFeed: "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD",
  },
  {
    name: "USDC",
    symbol: "USDC",
    logo: "/token/usdc.png",
    decimals: 6,
    addresses: {
      11155111: "0xab0c196dba12297e4c5b9a414013230a527b4a4b",
      43113: "0xC014F158EbADce5a8e31f634c0eb062Ce8CDaeFe",
      421614: "0x5df6ed08eec2fd5e41914d291c0cf48cd3564421",
      84532: "0xcba01c75d035ca98ffc7710dae710435ca53c03c",
    },
    priceFeed: "0x97FE42a7E96640D932bbc0e1580c73E705A8EB73",
  },
  {
    name: "USDT",
    symbol: "USDT",
    logo: "/token/usdt.png",
    decimals: 6,
    addresses: {
      11155111: "0xe8add858b8a2f6e41d67008a58058010b9c0ba04",
      43113: "0x1E713E704336094585c3e8228d5A8d82684e4Fb0",
      421614: "0x716bdb0129ad528162477e2f426ba061adb41621",
      84532: "0x49f82b20894e6a1e66238fb50278ac60b57676ee",
    },
    priceFeed: "0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad",
  },
];
