import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const getWalletById = (id: number) => {
    const hdWallet = ethers.utils.HDNode.fromMnemonic(process.env.MNEMONIC || 'neglect nothing frost inner fish benefit humble since tag buffalo cluster neck');
    return hdWallet.derivePath(`m/44'/60'/0'/${id}/0000`)
}

const main = async () => {
    const ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL || "http://localhost:8545");
    const wallet = new ethers.Wallet(getWalletById(0).privateKey, ethProvider); // Acount with ID=0 is owner of contract
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, process.env.CONTRACT_ABI!, wallet);
    await contract.deployed();

    const transaction = await contract.depositFor(getWalletById(1).address, getWalletById(2).address, 1000);
    const result = await transaction.wait();

    console.log(transaction);
    console.log(result);
}

main().then().catch(error => console.error(error));
