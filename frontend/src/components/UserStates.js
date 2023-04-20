import { atom } from "recoil";

export const currentAccountCommon = atom({
  key: "currentAccount",
  default: ""
});

export const displayCommon = atom({
  key: "display",
  default: "..."
});

export const tokenIdCommon = atom({
  key: "tokenId",
  default: 1
});

export const ethValueCommon = atom({
  key: "ethValue",
  default: ""
});

export const balanceCommon = atom({
  key: "balance",
  default: 0
});

export const subscribeStatusCommon = atom({
  key: "subscribeStatus",
  default: "OFF"
});

export const walletAddressCommon = atom({
  key: "walletAddress",
  default: ""
});

export const walletBalanceCommon = atom({
  key: "walletBalance",
  default: 0
});