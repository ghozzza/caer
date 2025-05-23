# Caér Finance

## Project Demo
[Go to site](https://caerfinance.vercel.app/)

![Project Screenshot](https://github.com/ghozzza/caer-finance/blob/main/caer-fe/public/caer-fi-home.png)

---

## Overview

### Introduction to Caér Finance

Welcome to **Caér Finance**, a cross-chain lending and borrowing protocol purpose-built to serve as a foundational DeFi primitive on the Pharos network.

Caér is designed to facilitate secure, efficient, and scalable decentralized financial services by enabling users to lend, borrow, and manage collateral across multiple blockchain ecosystems. Through this approach, Caér enhances capital efficiency while contributing directly to Total Value Locked (TVL) and transaction volume on Pharos.

Leveraging the capabilities of Espresso’s Application-Specific Sequencer (ASS) and a solver-based coordination architecture, Caér ensures trustless cross-chain execution with rapid finality. This infrastructure eliminates reliance on centralized bridges and custodians, promoting decentralization without compromising performance or security.

As one of the first lending protocols deployed on Pharos, Caér plays a critical role in expanding the network’s ecosystem. It serves as a modular, composable financial layer that other decentralized applications can integrate with—thereby supporting broader protocol interoperability and future ecosystem growth.

By offering a robust DeFi experience with a focus on TVL growth, cross-chain liquidity access, and institutional-grade infrastructure, Caér aims to position Pharos as a compelling destination for users and developers seeking novel, blockchain-based financial solutions.

---

## What is Caér Finance?

**Caér Finance** is a next-generation cross-chain lending and borrowing protocol developed to serve as a foundational decentralized finance (DeFi) primitive within the Pharos ecosystem. It facilitates seamless asset supply, borrowing, and management across multiple blockchain networks through a unified platform, eliminating the need for centralized custodians or traditional bridging mechanisms.

At its core, Caér is powered by an Application-Specific Sequencer (ASS), designed to manage transaction ordering, data verification, and execution across chains in a secure, transparent, and trustless manner. This sequencer ensures consistency and correctness in cross-chain operations, enabling reliable financial interactions at scale.

To reinforce transaction integrity and ensure timely finality, Caér integrates with the Espresso protocol, leveraging its decentralized finality layer. Through this integration, Caér benefits from rapid and secure confirmation of cross-chain transactions while maintaining alignment with the principles of decentralization and verifiability.

By combining protocol-specific sequencing with robust cross-chain finality infrastructure, Caér delivers a modular, secure, and high-performance lending platform—positioning itself as a critical driver of liquidity, adoption, and composability across the Pharos ecosystem and beyond.

---

## Key Features

- **Application-Specific Sequencer (ASS)**  
  Custom-built sequencer that governs the ordering, validation, and execution of cross-chain transactions in a deterministic and trustless manner.

- **Fast & Secure Cross-Chain Finality (Powered by Espresso)**  
  Seamless and rapid transaction confirmation layer that ensures confidence in cross-chain operations.

- **Seamless Cross-Chain Lending, Borrowing & Swap**  
  Unified interface for supply, borrowing, and managing assets across chains, including on-chain swap functionality.

- **Trustless and Transparent Execution**  
  All operations are fully on-chain using audited smart contracts to preserve user sovereignty.

- **Adaptive Interest Rate and Risk Framework**  
  Dynamic model based on market conditions and liquidity to optimize protocol health and user incentives.

- **Liquidity Aggregation and Capital Efficiency**  
  Pooled liquidity from multiple chains increases borrowing power and minimizes capital fragmentation.

---

## Why Caér Finance?

- **True Cross-Chain Lending & Borrowing**  
  Trust-minimized, native cross-chain liquidity access without reliance on third-party interoperability.

- **Secure and Timely Transaction Finality**  
  Fast confirmations via Espresso finality layer for safe and efficient market participation.

- **Trustless Execution via Application-Specific Sequencer (ASS)**  
  Decentralized infrastructure ensuring robust and accurate coordination.

- **Capital-Efficient Liquidity Aggregation**  
  Enables advanced strategies and maximizes utility of idle capital.

- **Modular, Scalable, and Ecosystem-Ready**  
  Composable with other dApps and built for long-term utility on Pharos.

---

## Problem

### Problems Caér Finance Solves

- **Fragmented Liquidity**  
  Combines liquidity across chains, overcoming the limitations of siloed lending markets.

- **Slow & Inefficient Liquidations Cross-Chain**  
  Uses ASS and Espresso to execute fast and secure liquidations across different ecosystems.

- **Security Risks in Cross-Chain Interactions**  
  Reduces vulnerabilities associated with centralized bridges and unverified data transmission.

- **Isolated Liquidity Pools**  
  Aggregates capital into a shared liquidity layer, increasing usability and returns.

- **Bootstrap Challenges in New Chain Deployments**  
  Supports new chains like Pharos with incentives and infrastructure that foster adoption.

---

## Challenges

### Challenges Faced by Caér Finance

- **Technological Complexity**  
  Integrating ASS, Espresso, and solver logic while ensuring security and performance is a non-trivial engineering task.

- **Cross-Chain Liquidity Management**  
  Real-time coordination of liquidity and rates across independent networks is essential and challenging.

- **Security & Smart Contract Risks**  
  Mitigated through on-chain, verifiable, and decentralized execution.

- **Ecosystem Onboarding and Bootstrap Challenges**  
  Caér must bootstrap user adoption and composability early to become a viable DeFi foundation.

---

## How We Achieve Cross-Chain Capability
![Flowchart Screenshot](https://caer-fi.gitbook.io/~gitbook/image?url=https%3A%2F%2F1010550430-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FxRSOS0hj1VBPl9GetrLn%252Fuploads%252FkdSU02m0gVfJffuEYOO5%252FNetwork%2520A.png%3Falt%3Dmedia%26token%3Db86b0df4-40d0-4caf-a51a-93b9c87d3d3e&width=768&dpr=2&quality=100&sign=aac57a0c&sv=2)
This diagram illustrates the cross-chain lending and borrowing mechanism in Caér, powered by the Pharos and Arbitrum networks. The system ensures trustless execution, fast finality, and secure interoperability using Application-Specific Sequencer (ASS), Espresso Finality, Solvers, and Supra Oracle.

### Cross-Chain Lending Workflow

1. **User Collateral Deposit**  
   The user deposits 1 PAXG (tokenized gold) as collateral on Chain A (Pharos).

2. **User Loan Request**  
   The user initiates a request to borrow 100 USDC on Chain B (Arbitrum).

3. **Oracle Price Feed (via Supra Oracle)**  
   Before processing the loan, Supra Oracle provides the real-time USD value of 1 PAXG, ensuring that the collateral meets the required Loan-to-Value (LTV) ratio.

4. **ASS Verification**  
   ASS verifies the deposit on Chain A and uses the price data from Supra to confirm the user's collateral is sufficient. The ASS cross-checks the deposit and price status before approving the loan request.

5. **Espresso Confirmation & ASS Signature Generation**
   The sequencer leverages Espresso confirmations to ensure transaction finality within sub-15 seconds.Once confirmed, ASS generates a signature, verifying that the deposit exists, the price is valid, and the loan request is approved.

6. **Transaction Processing**  
   The generated ASS signature is embedded into the transaction, enabling secure execution on Chain B.

7. **Solver Loan Execution**  
   The solver, upon receiving the verified ASS signature, releases 100 USDC to the user's address on Chain B. By integrating ASS, Supra, and Espresso, Caér ensures trustless execution, accurate collateral valuation, and fast cross-chain finality—making lending and borrowing secure, scalable, and RWA-friendly.

> **Note:**  
> For the purposes of this hackathon, we are using mock tokens to simulate transactions and interactions within the platform. Additionally, the platform is operating on a testnet environment.

---

## Swap
![Swap Screenshot](https://caer-fi.gitbook.io/~gitbook/image?url=https%3A%2F%2F1010550430-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FxRSOS0hj1VBPl9GetrLn%252Fuploads%252FtOe2xPpbATOlwH7fvaLw%252FNetwork%2520A%2520%281%29.png%3Falt%3Dmedia%26token%3Ddaeceee6-d06c-44e7-820c-78c94c1b5e31&width=768&dpr=2&quality=100&sign=7966739b&sv=2)
Caér implements a decentralized swap mechanism inspired by Automated Market Maker (AMM) models, enabling seamless token exchanges within the Caér Pool. The workflow below describes the process of token swapping and liquidity provision on the platform. But how does Caér’s swap system enhance the lending and borrowing experience? Unlike traditional swaps, Caér’s decentralized swap mechanism is designed specifically to trade collateral assets. This means users must hold an active lending or borrowing position to access swap functionalities, ensuring capital efficiency and seamless liquidity management.


### 1. Liquidity Provider 💧
Liquidity Providers (LPs) deposit pairs of tokens (e.g., Token A and Token B) into the **Caér Pool**.

In return, LPs receive **Pool Tokens**, which represent their share of the liquidity pool and entitle them to a proportion of the transaction fees generated from swaps.

### 2. Caér Pool Management 🗃️
The **Caér Pool** maintains reserves of the deposited tokens and continuously updates balances as users perform swap operations.

These reserves are used to facilitate trades between Token A and Token B **without relying on external order books**.

### 3. Swap Mechanism 🔄
Traders initiate swaps through the **Caér Swap** interface by selecting the tokens they wish to exchange — such as swapping Token A for Token B.

**What makes Caér unique:**

To access swap functionalities, users **must hold an active lending or borrowing position**.  
This ensures that swaps are **directly integrated with the lending and borrowing protocol**, enabling **capital efficiency** and **enhanced liquidity management**.

The swap functionality applies an **Automated Market Maker (AMM)** formula to determine the exchange rate, considering the current reserves of the involved tokens.

Upon successful execution, the **Caér Pool** updates the reserves accordingly.


### 4. Transaction Fees 💸
A small fee is applied to each swap, **distributed to Liquidity Providers based on their share of the pool**.

These fees **incentivize LPs to maintain liquidity** within the pool, enhancing platform efficiency and accessibility.

### 5. Liquidity Withdrawal 📤
LPs can withdraw their liquidity at any time by **redeeming their Pool Tokens**.

Upon withdrawal, the provider receives their **proportional share of the pool’s reserves** along with any **accumulated fees**.


> **Note:**  
> For the purposes of this hackathon, we are using **mock tokens** to simulate transactions and interactions within the platform.  
> Additionally, the platform is operating on a **testnet environment**.


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

