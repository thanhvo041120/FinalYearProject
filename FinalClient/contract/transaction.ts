import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const getWalletById = (id: number) => {
    const hdWallet = ethers.utils.HDNode.fromMnemonic(process.env.MNEMONIC || 'neglect nothing frost inner fish benefit humble since tag buffalo cluster neck');
    return hdWallet.derivePath(`m/44'/60'/0'/${id}/0000`)
}


const main = async () => {
    const ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL || "http://localhost:8545");
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, process.env.CONTRACT_ABI!, ethProvider);

    const filter = contract.filters.Transfer(getWalletById(1).address, null, null);

    const transactions = await contract.queryFilter(filter);

    console.log(transactions);
}

main().then().catch(error => console.error(error));
