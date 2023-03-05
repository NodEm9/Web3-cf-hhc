const { ethers, run, network } = require("hardhat")


async function main() {
const SimpleStorageFactory = ethers.getContractFactory(
  "SimpleStorage"
)
console.log("Deploying contract...")
const simpleStorage = (await SimpleStorageFactory).deploy()
await simpleStorage.deployed 
console.log(`Deployed contract to: ${(await simpleStorage).address}`)
  if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block txes")
    await (await simpleStorage).deployTransaction.wait(6)
    await verify((await simpleStorage).address, [])

  }

  const currentValue = await (await simpleStorage).retrieve()
  console.log(`Current value is: ${await currentValue}`)

  const transactionResponse = await (await simpleStorage).store(8)
  await (transactionResponse)
  const updatedValue = await (await simpleStorage).retrieve()
  console.log(`Updated value is: ${await updatedValue}`)
}; 

async function verify(contractAddress, args) {
    console.log("Verifing contyract...")
    try {
        await run("verify:verify", {
        address: contractAddress,
        constructorArgument: args
      })
    } catch (e) {
      if(e.message.toLowerCase().includes("already verified")) {
        console.log("Already Verified")
      }else{
        console.log(e)
      } 
    }
} 

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
});