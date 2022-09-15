import { ethers } from "ethers";

let mnemonics = ethers.Wallet.createRandom().mnemonic;
console.log(mnemonics.phrase);
