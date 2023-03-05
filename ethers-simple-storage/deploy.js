const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();


// import ethers from "ethers";
// import * as fs from "fs";
// import "dotenv/config"

async function main() {
    // 127.0.0.1:7545
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
    // let wallet = ethers.Wallet.fromEncryptedJsonSync( 
    //     encryptedJson,
    //     process.env.PRIVATE_KEY_PASSWORD
    // );
    // wallet = await wallet.connect(provider);
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
         "utf8"
    );
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Started deployong your contract, please wait...")
    const contract = await contractFactory.deploy();
    await contract.deploymentTransaction;
    console.log(`Contract Address: ${contract.address}`)
    //Get number
    const currentFavoriteNumber = await contract.retrieve();
    console.log(`Current favorite number is, ${currentFavoriteNumber.toString()}`);
    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    const updatedFavoriteNumber = await contract.retrieve();
    console.log(`Updated favorite number is: ${updatedFavoriteNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
});