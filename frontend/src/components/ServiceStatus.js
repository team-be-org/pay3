import { atom } from "recoil";

export const currentAccountCommon = atom({
  key: "currentAccount",
  default: ""
});

export const displayCommon = atom({
  key: "display",
  default: "..."
});

export const ethValueCommon = atom({
  key: "ethValue",
  default: ""
});

export const balanceCommon = atom({
  key: "balance",
  default: 0
});


export const walletAddressCommon = atom({
  key: "walletAddress",
  default: ""
});
