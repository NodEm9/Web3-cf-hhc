const { run } = require("hardhat")

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

module.exports = { verify };