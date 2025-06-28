# Automatic Token Addition to Wallet

This feature allows users to automatically add ERC-20 tokens to their connected wallet with a single click, eliminating the need to manually copy and paste token addresses.

## How It Works

The automatic token addition uses the `wallet_watchAsset` method, which is supported by most modern Web3 wallets including MetaMask, WalletConnect, and others.

## Implementation

### 1. Basic Usage

```typescript
import { addTokenToWallet } from "@/lib/walletUtils";

const handleAddToken = async () => {
  const selectedToken = {
    name: "Wrapped Ethereum",
    symbol: "WETH",
    logo: "/token/weth.png",
    decimals: 18,
    address: "0x63CFd5c58332c38d89B231feDB5922f5817DF180"
  };
  
  await addTokenToWallet(tokenAddress, selectedToken);
};
```

### 2. Using the Reusable Components

#### AddTokenButton Component
```tsx
import { AddTokenButton } from "@/components/ui/add-token-button";

<AddTokenButton
  tokenAddress={selectedTokenAddress}
  selectedToken={selectedToken}
  chainId={43113}
  variant="outline"
  size="sm"
>
  Add WETH to Wallet
</AddTokenButton>
```

#### AddTokenIconButton Component
```tsx
import { AddTokenIconButton } from "@/components/ui/add-token-button";

<AddTokenIconButton
  tokenAddress={selectedTokenAddress}
  selectedToken={selectedToken}
  chainId={43113}
  title="Add WETH to wallet"
/>
```

### 3. Enhanced Version with Better Error Handling

```typescript
import { addTokenToWalletEnhanced } from "@/lib/walletUtils";

const handleAddToken = async () => {
  const success = await addTokenToWalletEnhanced(
    tokenAddress, 
    selectedToken, 
    chainId
  );
  
  if (success) {
    console.log("Token added successfully");
  }
};
```

## Supported Wallets

- MetaMask
- WalletConnect
- Coinbase Wallet
- Trust Wallet
- Most other EIP-1193 compliant wallets

## Error Handling

The implementation includes comprehensive error handling for:

- **No wallet detected**: Prompts user to install a compatible wallet
- **User rejection**: Handles when user cancels the token addition
- **Unsupported method**: Falls back to manual addition instructions
- **Network errors**: Provides helpful error messages

## Token Information Required

To add a token to a wallet, you need:

- **Address**: The token contract address
- **Symbol**: The token symbol (e.g., "WETH")
- **Decimals**: Number of decimal places (e.g., 18)
- **Image**: URL to the token logo (optional but recommended)

## Example in Faucets Form

The faucets form demonstrates the complete implementation:

```tsx
// In the token address section
<button
  onClick={addTokenToWallet}
  className="text-[#141beb] hover:text-[#141beb]/80 transition-colors"
  title="Add token to wallet automatically"
>
  <Wallet className="w-3 h-3" />
</button>
```

## Browser Compatibility

- ✅ Chrome/Chromium-based browsers
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

## Security Considerations

- The `wallet_watchAsset` method only adds tokens to the wallet's display
- It does not grant any permissions or access to user funds
- Users can always remove tokens from their wallet later
- The method requires explicit user approval

## Troubleshooting

### Token not appearing in wallet
1. Ensure the wallet is connected to the correct network
2. Check that the token address is correct for the current network
3. Try refreshing the wallet or reconnecting

### Method not supported
1. Update to the latest version of your wallet
2. Try a different wallet that supports `wallet_watchAsset`
3. Use the manual copy/paste method as fallback

### Error messages
- "No wallet detected": Install MetaMask or another compatible wallet
- "User rejected": User cancelled the request - this is normal behavior
- "Method not supported": Wallet doesn't support automatic token addition 