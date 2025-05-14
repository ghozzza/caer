import { Address } from "viem";

export const chain_id: number = 8453;
// export const chain_id: number = 8453;

let temp_mockWeth
let temp_mockWbtc
let temp_mockUsdc
let temp_mockUsdt
let temp_mockPepe
let temp_mockBnvda
let temp_mockSaapl
let temp_mockPaxg
let temp_priceFeed
let temp_factory
let temp_lendingPool
let temp_lendingPoolSequencer
let temp_position

// Pharos
/****************************************************************************** */
if (chain_id === 8453) {
temp_mockWeth = "0x4200000000000000000000000000000000000006" as Address;
temp_mockUsdc = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address;
temp_mockWbtc = "0x53241438332F16dB835Ace4244Ade8C07178735a" as Address;
temp_mockUsdt = "0x8ea9fD8F3ae0e1D332CeA723654684f789787749" as Address;
temp_mockPepe = "0xe87cDFe6832aa45958c06A62716c6Fb6Fdd200E7" as Address;
temp_mockBnvda = "0xbC44a2B9c5B1a9daB8158242112841ea0c3a49C8" as Address;
temp_mockSaapl = "0x3A4F0980915fFCf8831781820C2BD674eE1e1144" as Address;
temp_mockPaxg = "0x8cE8CD7F4182A29F87f4c1A3d07C5dF6522aa22D" as Address;
temp_priceFeed = "0x60CAD266bDD59ca75d3317E9dc4d6CC93859c488" as Address;
temp_factory = "0x593c05Fd0D1bD354991c6E011a35d92c88A10825" as Address;
temp_lendingPool = "0x77171fC580664700a29B81eae437797Ed88088F5" as Address;
temp_lendingPoolSequencer = "0xc62809F1A4721aE9D88737907c17eE88CCE17E68" as Address;
temp_position = "0xF979b2001616601A41d21Fb922E23Ac9d6870497" as Address;
}
/****************************************************************************** */
else {
temp_mockWeth = "0x689c1eF623a32D7d11296265013f42C7973Fda86" as Address;
temp_mockWbtc = "0x94ce8C98D12389263C589bE2AA5B98fF391EEb56" as Address;
temp_mockUsdc = "0x8d0482D342168823fed8739dDaC881F5F1aD5a5C" as Address;
temp_mockUsdt = "0x2d2D27ca25ff36C60c53a7112fE8d36FD3b41566" as Address;
temp_mockPepe = "0x8f220895ae229d5B39c8B86BDaae73a4dD513CB2" as Address;
temp_mockBnvda = "0xDb4A78C3FBc7BA4b71273d907e1a7Fc4EC9dE5d5" as Address;
temp_mockSaapl = "0x3c00a25678aE8e23ae6405F88857e38dE89c886D" as Address;
temp_mockPaxg = "0x1cc5007ae971F6C5F99506F94c52c494dfC7b314" as Address;
temp_priceFeed = "0xf8BaFD421BF510a492059F98e1a61F22793eb540" as Address;
temp_factory = "0x9108c9d911846e925b24Bc9a1d8Abbf965212957" as Address;
temp_lendingPool = "0x8370aFfe9a1c3A258A4E22B71A0c1F4D9b5715Eb" as Address;
temp_lendingPoolSequencer = "0x2851D80C5AF11E4BFcA0522CCFa7d390acDe9Bc0" as Address;
temp_position = "0x0521A7e762Fe11705B2ae853Bd93Ad5341e60Ce9" as Address;
}


export const mockWeth = temp_mockWeth;
export const mockWbtc = temp_mockWbtc;
export const mockUsdc = temp_mockUsdc;
export const mockUsdt = temp_mockUsdt;
export const mockPepe = temp_mockPepe;
export const mockBnvda = temp_mockBnvda;
export const mockSaapl = temp_mockSaapl;
export const mockPaxg = temp_mockPaxg;
export const priceFeed = temp_priceFeed;
export const factory = temp_factory;
export const lendingPool = temp_lendingPool;
export const lendingPoolSequencer = temp_lendingPoolSequencer;
export const position = temp_position;

export const solverAddress= "0x44C444f33E25b382AD64C88f40E286966CeC0535" as Address;
export const hxAddress = "https://pharosscan.xyz/tx/" as Address;

