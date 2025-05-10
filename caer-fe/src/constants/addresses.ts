import { Address } from "viem";

export const chain_id: number = 50002;
// export const chain_id: number = 11155420;

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
if (chain_id === 50002) {
temp_mockWeth = "0x18858A62e46DCb501F1c69893ee0f7F2323581a5" as Address;
temp_mockWbtc = "0xa0624E61a525Ba2A71B793413a89F9a624646081" as Address;
temp_mockUsdc = "0x42260072BbfaD1b50AD01C8aAdeA5dE345f2E752" as Address;
temp_mockUsdt = "0x6399a0cbEcB277CaCA35A907B3BA3A8079C0bE7b" as Address;
temp_mockPepe = "0x4a363F2dE88567623Ff351584Eb9d8B71CD1fEb8" as Address;
temp_mockBnvda = "0x33E4Ca17132C90a062a692F062C94Ef3d4D727bA" as Address;
temp_mockSaapl = "0xfb776096EbDfFEf3C4FAb6076a4950445Ae33f8f" as Address;
temp_mockPaxg = "0x1EFE2c1EcDf8511538d2aDc20Bae9417b8b6f359" as Address;
temp_priceFeed = "0x671f33611ca94095fD4f06d539b0F2c13e70F362" as Address;
temp_factory = "0xF64b9a1bbD331eB5e3Fa5c80fe9417E1A3F96F12" as Address;
temp_lendingPool = "0x9F19f49DA9D24382892a78D8d966441DCc4ee89b" as Address;
temp_lendingPoolSequencer = "0xC5711CccD5f420ED4356d4d19a8c9E31572f09f2" as Address;
temp_position = "0x72e06B77BEE9E2093f831B9494cD1e32Ae0Ad1dd" as Address;
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

