// ConnectButton.tsx
import { useEthers, useEtherBalance } from "@usedapp/core";
import { ethers } from "ethers";
import { Button } from "antd";

export default function ConnectButton() {
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  function handleConnectWallet() {
    console.log("connect wallet");
    activateBrowserWallet();
  }

  if (account && etherBalance) {
    const amount = ethers.utils.formatEther(etherBalance.toString());
    return (
      <span color="white" fontSize="md">
        <b>{amount} tFIL</b> {account.slice(0, 6)}**
      </span>
    );
  }
  return (
    <span className="right connect-button">
      <Button type="primary" onClick={handleConnectWallet}>
        Connect wallet
      </Button>
    </span>
  );
}
