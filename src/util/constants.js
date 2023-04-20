export const APP_NAME = "HuddleCast";
export const APP_DESC =
  "Create sellable video collections from your gaming or video streams.";

export const UPLOAD_INFO = `
Note: In order to sell a video or video bundle, it must be
finished and as a recording. The recording(s) will be secured and
delivered via a special IPFS link connected to a Hyperspace bundle smart contract.
`;

export const CONNECT_TEXT = "Connect Wallet";

// https://docs.filecoin.io/basics/assets/metamask-setup/
export const ACTIVE_NETWORK = {
  name: "Filecoin Hyperspace testnet",
  url: "https://explorer.glif.io",
  rpc: "https://api.hyperspace.node.glif.io/rpc/v1",
  chainId: 3141,
  currency: "tFil",
};

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

export const HUDDLE_PROJECT_ID = requireEnv("REACT_APP_HUDDLE_PROJECT_ID");
export const HUDDLE_API_KEY = requireEnv("REACT_APP_HUDDLE_API_KEY");