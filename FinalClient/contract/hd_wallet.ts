import { ethers } from "ethers"
import dotenv from "dotenv";

dotenv.config();

const hdNode = ethers.utils.HDNode.fromMnemonic(process.env.MNEMONIC || 'neglect nothing frost inner fish benefit humble since tag buffalo cluster neck');

// generate wallet from id 0 to 10

for (let id = 0; id <= 10; id++) {
    console.log('-------------');
    console.log(`Wallet ${id}`);
    console.log(hdNode.derivePath(`m/44'/60'/0'/${id}/0000`));
}
