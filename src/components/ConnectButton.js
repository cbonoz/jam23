// ConnectButton.tsx
import React, { useState } from "react";
import { ethers } from "ethers";
import { Button } from "antd";
import { getPrimaryAccount } from "../contract/huddleContract";

export default function ConnectButton({account, onClick}) {
  if (account) {
    return (
      <span color="white" fontSize="md">
        <b>Hello: {account.slice(0, 6)}**</b>
      </span>
    );
  }
  return (
    <span className="right connect-button">
      <Button type="primary" onClick={onClick}>
        Connect wallet
      </Button>
    </span>
  );
}
