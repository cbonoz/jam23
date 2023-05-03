export const APP_NAME = "HuddleCast";
export const APP_DESC =
  "Create sellable video collections from your gaming or video streams.";

export const UPLOAD_INFO = `
Note: In order to sell a video or video bundle, it must be
finished and as a recording. The recording(s) will be secured and
delivered via a special IPFS link connected to a HuddleCast bundle smart contract.
`;


export const ABOUT_INFO = `

Existing streamers often have large followings and post their content to youtube or other sites after streaming on live networks like Twitch - but that could be the end of it. Given these followings, we want to provide an opportunity to further connect with fans by providing memorabilia, and providing an additional revenue opportunity for the content creator. HuddleCast allows any streamer to turn collections of their streamed content into a purchase-able contract and IPFS video group.

These collections can also be later resold and traded by new owners.

Many video marketplace platforms exist, but:

- There's not a dominant one that appeals to the streaming (gaming and non-gaming) streaming market.
- May not integrate with existing streaming networks. HuddleCast doesn't care how you broadcast, only that the uploaded listings have a particular format and content.
- Have higher overhead - contentstream backed by Filecoin and allows you to re-use existing assets and content if you wish.
- Many streamers are already into technology and can port their existing streams onto the platform, or use the natively integrated Huddle01 experience to create a group livestream and sell the video bundle directly from the app immediately after it's created.
- HuddleCast is a niche platform not focused on current categories like artwork/real estate - only video content.
`;


export const CONNECT_TEXT = "Connect Wallet";

export const IPFS_BASE_URL = "https://w3s.link/ipfs"

// https://docs.filecoin.io/basics/assets/metamask-setup/
export const ACTIVE_NETWORK = {
  name: "Filecoin Hyperspace testnet",
  url: "https://explorer.glif.io",
  rpc: "https://api.hyperspace.node.glif.io/rpc/v1",
  chainId: 3141,
  currency: "tFIL",
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