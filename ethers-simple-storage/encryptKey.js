const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

// import ethers from "ethers";
// import * as fs from "fs";
// import "dotenv/config"


async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
    const encryptedJsonKey = await wallet.encryptSync(
        process.env.PRIVATE_KEY_PASSWORD,
        process.env.PRIVATE_KEY
    )
    // console.log(encryptedJsonKey)
    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey)
}

// function progressCb({elapsedMs, timeLeft, progress}) {
//     console.log(`We are {progress * 100}% complete waiting`);
//   }

main()
 .then(() => process.exit(0))
//  .then(() => {progressCb})
 .catch((error) => {
    console.error(error)
    process.exit(1)
})