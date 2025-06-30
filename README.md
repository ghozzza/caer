# Caér Finance

# Overview

## Introduction to Caér Finance

Welcome to Caér Finance, a permissionless cross-chain lending and borrowing protocol seamlessly integrated with Chainlink CCIP and Chainlink Data Streams.

Caér addresses a key limitation in DeFi by enabling users to deposit collateral on one blockchain and borrow assets on another, leveraging Chainlink’s secure cross-chain infrastructure.michael This approach eliminates the need for centralized bridges or custodial intermediaries.

## Key Features

### Permissionless Cross-Chain Lending & Borrowing

Caér Finance allows decentralized lending and borrowing across multiple blockchain networks without intermediaries. Users can supply collateral on one chain and borrow assets on another, promoting financial inclusion and maintaining full custody over assets.

### Secure Cross-Chain Messaging Powered by Chainlink CCIP

Utilizing Chainlink Cross-Chain Interoperability Protocol (CCIP), Caér ensures secure and atomic cross-chain transactions through a burn-and-mint model. This mechanism guarantees supply consistency and reduces systemic risk across blockchain environments.

### Real-Time Collateral Valuation via Chainlink Data Streams

Integrating Chainlink Data Streams provides Caér with real-time price updates, enabling accurate loan-to-value (LTV) assessments and transparent risk management. These data feeds enhance user transparency and support future risk-based features.

### Native Collateral Swap Mechanism

Caér includes a native collateral swap feature, allowing users to adjust collateral compositions without closing positions. Integrated with Chainlink Data Streams, this feature ensures swaps are executed at fair market values based on current pricing data.

## Join Us

Caér Finance is built on Chainlink’s robust infrastructure, leveraging CCIP for secure cross-chain interoperability and Data Streams for real-time market data. Join us in building the future of cross-chain DeFi—where liquidity, security, and usability transcend single-chain limitations.

Explore how Caér can empower developers and users alike to unlock cross-chain capital efficiency in a permissionless ecosystem. Let’s build a more connected DeFi together.

Powered by Chainlink.

---
# Problems and Solutions

In building a permissionless cross-chain lending protocol, we identified the most pressing challenges in multichain DeFi and designed focused solutions through our integration with Chainlink’s decentralized infrastructure.

## Fragmented Liquidity Across Chains

**Problem**: DeFi users are often constrained by isolated liquidity pools on individual blockchains, limiting access to optimal borrowing or lending opportunities.

**Caér Finance's Solution**: Caér Finance solves this through secure cross-chain functionality powered by Chainlink CCIP, enabling users to deposit collateral on one chain and borrow on another without relying on centralized bridges or wrapped assets. This unlocks multichain capital access and improves capital efficiency across ecosystems.

## Delayed Price Feeds

**Problem**: Traditional oracles often suffer from latency or low update frequency, resulting in outdated collateral pricing, miscalculated LTV ratios, and increased exposure to market volatility.

**Caér Finance's Solution**: By integrating Chainlink Data Streams, Caér accesses sub-second, real-time price data on-chain. This ensures up-to-date collateral valuations and dynamic loan tracking, empowering users with accurate, real-time position insights.

## Closed and Restrictive Protocols Hinder Broader Participation

**Problem**: A significant number of lending platforms operate within closed ecosystems, relying on mechanisms such as whitelisting, centralized governance, or limited collateral support. These restrictions reduce accessibility, limit user autonomy, and compromise the principles of transparency and decentralization.

**Caér Finance's Solution**: Caér Finance is designed as a fully permissionless protocol, enabling any user to engage in lending or borrowing activities without the need for prior approval or reliance on centralized intermediaries. This open-access architecture fosters inclusivity, enhances transparency, and aligns with the core ethos of decentralized finance by supporting unrestricted global participation.

## Collateral Management is Inflexible

**Problem**: Other lending protocols require users to exit positions to adjust their collateral, incurring costs and friction during portfolio adjustments.

**Caér Finance's Solution**: Caér introduces a native in-protocol collateral swap mechanism, allowing users to seamlessly change their collateral type without closing positions. This feature is supported by Chainlink Data Streams, ensuring accurate pricing during swaps and enabling more agile, responsive portfolio management.

---

# Challenges

## Challenges Faced by Caér Finance

### Secure Cross-Chain Messaging Without Centralization

**Challenge**: Implementing cross-chain functionality in DeFi often relies on custodial bridges or wrapped assets, which introduce significant security risks and systemic vulnerabilities. Caér’s challenge was to deliver secure and verifiable cross-chain communication without compromising decentralization. By integrating Chainlink CCIP, Caér had to ensure not only the integrity of cross-chain token transfers but also the safe orchestration of protocol logic across multiple blockchain environments. This required careful handling of message validation, failure recovery, and trust minimization throughout the system.

### Real-Time Price Delivery and On-Chain Integration

**Challenge**: Other lending protocols can function with delayed price updates, but in a cross-chain setting, real-time valuation is essential. Caér’s integration of Chainlink Data Streams introduces technical challenges related to on-chain data consumption, synchronization across chains, and oracle update frequency. Ensuring that these real-time data feeds are efficiently integrated, cost-effective, and robust against volatility or rapid price swings is critical to maintaining accurate collateral tracking and user confidence in borrowing limits.

### Maintaining Protocol Resilience Against Oracle Manipulation

**Challenge**: Relying on a single source of truth can expose lending protocols to manipulation or failure. Even with Chainlink’s decentralized architecture, integrating Data Streams into core protocol operations requires rigorous safeguards, such as deviation thresholds, update throttling, and fallback pricing logic. Caér must ensure that its reliance on external data sources does not introduce fragility or open attack vectors, especially when these prices are used for critical operations like collateral adjustment or eligibility verification.

### Operational Coordination Across Multiple Chain Environments

**Challenge**: Running a protocol that operates across chains using CCIP introduces operational and infrastructure complexity. Caér must account for chain-specific behavior, gas costs, execution timing, and differences in token standards. Coordinating token burns, message confirmations, and mints across heterogeneous networks while maintaining consistent user experience requires both technical precision and robust testing frameworks. Leveraging Chainlink CCIP’s capabilities demands rigorous adherence to cross-chain standards and careful monitoring of interchain message flow to ensure system integrity.

# How We Achieve Cross-Chain Capability
![Flowchart Screenshot](https://caer-finance-ccip.gitbook.io/caer-finance-docs/~gitbook/image?url=https%3A%2F%2F172083510-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FVsNKiGOr7l1Swz9iRDmK%252Fuploads%252FCwxTYAcXnpfSbezsGmvh%252Fcaernewlendbor.gif%3Falt%3Dmedia%26token%3D4efab80d-3125-4a66-b8c8-39f1c2d9cd0b&width=768&dpr=4&quality=100&sign=e1cb7b1b&sv=2)
Caér Finance achieves secure and verifiable cross-chain lending by leveraging Chainlink’s Cross-Chain Interoperability Protocol (CCIP) to facilitate communication and token transfer between blockchain networks. The protocol enables users to deposit collateral on one chain and borrow stablecoins on another without relying on centralized bridges or wrapped assets by utilizing a secure burn-and-mint mechanism.

In our current architecture, as illustrated:

- On the **Source Chain (Avalanche Fuji)**, users deposit collateral (e.g., MockWAVAX) into the Caér Liquidity Pool. The deposited tokens are handled by `BasicTokenSender.sol`, which interacts with the Chainlink CCIP Router. This Router prepares a cross-chain message, processes transaction fees (in LINK or AVAX), and initiates a burn operation of the deposited tokens, removing them from circulation and preventing supply duplication.

- The burn-and-mint method, native to Chainlink CCIP’s token pool mechanism, ensures that tokens exist on only one chain at any time. The burn event is cryptographically verified and transmitted by Chainlink’s decentralized oracle network (DON), forming a secure proof of collateral transfer.

- Once received on the **Destination Chain (Arbitrum Sepolia)**, the corresponding CCIP Router invokes the `LendingPool.sol` contract. This contract verifies the message and proof, and accordingly credits the user with the right to borrow stablecoins (e.g., MockUSDC), which are minted or released from liquidity on the destination chain.

- Both MockWAVAX and MockUSDC are continuously priced using Chainlink Data Streams, a low-latency oracle feed that ensures accurate and high-frequency pricing. These feeds are crucial for determining borrowing capacity, monitoring risk exposure, and enabling dynamic collateral swap logic within the protocol.

By combining CCIP and Data Streams, Caér Finance unlocks native cross-chain borrowing with high levels of security, precision, and capital efficiency without relying on wrapped tokens or centralized liquidity hubs. This positions Caér as a modular, interoperable DeFi primitive ready to scale across blockchain ecosystems.

---

## Swap
![Swap Screenshot](https://caer-finance-ccip.gitbook.io/caer-finance-docs/~gitbook/image?url=https%3A%2F%2F172083510-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FVsNKiGOr7l1Swz9iRDmK%252Fuploads%252F7iRgTFqsZUbxsYM7110s%252Fswapcolcaer.png%3Falt%3Dmedia%26token%3Da1503862-6024-4f1a-9c09-1b716d8f2e7f&width=768&dpr=4&quality=100&sign=51a3ea27&sv=2)
Caér Finance incorporates a purpose-built collateral swap mechanism that enables users to modify their collateral composition directly within the protocol without exiting lending or borrowing positions. Inspired by the architecture of Automated Market Makers (AMM), the system is tightly integrated into the Caér Pool to facilitate real-time, on-chain token exchange with minimal friction.

## 1. Liquidity Provision and Pool Structure
Liquidity Providers (LPs) contribute token pairs such as Token A and Token B into the Caér Pool, which serves as the central liquidity reserve for swap operations. In return, LPs receive Pool Tokens, representing their proportional ownership and entitling them to a share of the accrued transaction fees from swaps.

The Caér Pool maintains segregated reserves for each token and continuously adjusts these balances as swaps are executed.

## 2. Swap Execution
Only users with active lending or borrowing positions are permitted to access the swap functionality. This requirement ensures that all swap operations are tied directly to collateral management, thereby improving capital efficiency and reducing unnecessary speculative activity.

When a user initiates a swap, such as swapping Token A for Token B, the swap logic references current reserve ratios and applies an AMM pricing formula (e.g., constant product model) to calculate the output amount. The system also integrates with Chainlink Data Streams to fetch real-time price references, ensuring fair execution and slippage protection.

## 3. Oracle Integration for Price Validation
To maintain accurate valuation of the swapped collateral, Caér utilizes Chainlink Oracles. These oracles deliver tamper-proof, real-time price feeds for all supported tokens, ensuring that each swap maintains alignment with market value. This is critical for maintaining healthy collateralization ratios and reducing systemic risk across lending positions.

## 4. Incentivization through Fees
Each swap transaction incurs a small liquidity fee, which is distributed among active LPs based on their share of the pool. This fee structure incentivizes continued liquidity provision and supports the long-term sustainability of the swap module.

---



## 🔗 Links

- 🌐 Website: [https://caerfinance.vercel.app](https://caerfinance.vercel.app/)
- 📚 Documentation: [https://caer-fi.gitbook.io/caer-finance-docs](https://caer-fi.gitbook.io/caer-finance-docs)
- 🏢 Organization: [https://github.com/ghozzza/caer-finance](https://github.com/ghozzza/caer-finance)
- 🎥 Video Demo Application: [Demo Apps] (https://youtu.be/xCRaanzcTPc)
- 🧑‍🏫 CAÉR Pitch Deck: [Presentation Deck] (https://youtu.be/Zmb6NwXq66g)
- 🖥️ Presentation Slides: [Canva Slides](https://www.canva.com/design/DAGleoJZCII/DhRV5oVDS5hdOlPlwkqhig/edit?utm_content=DAGleoJZCII&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

---
## 🔗 Smart Contracts 
### LendingPool ‼Deployed on Pharos Devnet
- **Contract Name:** LendingPool
- **Contract Address:** 0x9F19f49DA9D24382892a78D8d966441DCc4ee89b

### LendingPoolSequencer ‼Deployed on Arbitrum Sepolia
- **Contract Name:** LendingPoolSequencer
- **Contract Address:** 0x4CA9964bA32016F6Ba043Bfefc17BFf45E73469e

### MockUSDC ‼Import Token Contract Address to Your Wallet
- **Contract Name:** MockUSDC (Pharos Devnet)
- **Contract Address:** 0x42260072BbfaD1b50AD01C8aAdeA5dE345f2E752
- **Contract Name:** MockUSDC (Arbitrum Sepolia)
- **Contract Address:** 0xB55061A1c2dC4E5da0626371f3Bcd322d94aFE7a

### MockWETH ‼Import Token Contract Address to Your Wallet
- **Contract Name:** MockWETH (Pharos Devnet)
- **Contract Address:** 0x18858A62e46DCb501F1c69893ee0f7F2323581a5
- **Contract Name:** MockWETH (Arbitrum Sepolia)
- **Contract Address:** 0x2c2e865b4F45A3c5540e51088a3232828C8cc7Ed

### MockWBTC ‼Import Token Contract Address to Your Wallet
- **Contract Name:** MockWBTC (Pharos Devnet)
- **Contract Address:** 0xa0624E61a525Ba2A71B793413a89F9a624646081
- **Contract Name:** MockWBTC (Arbitrum Sepolia)
- **Contract Address:** 0x8Aa245cf3ad6dc239AfaA3B7498B378354a49D56

## 🔗 API
- **Sequencer:** https://caerfi-solver.vercel.app/api/borrow

## Pharos Devnet
- **RPC URL:** https://devnet.dplabs-internal.com/
- **Chain ID:** 50002
- **Blockexplorer:** https://pharosscan.xyz/
  
## Arbitrum Sepolia
- **RPC URL:** https://sepolia-rollup.arbitrum.io/rpc
- **Chain ID:** 421614
- **Blockexplorer:** https://sepolia.arbiscan.io/

## License

MIT License © 2025 Caér Finance

---

