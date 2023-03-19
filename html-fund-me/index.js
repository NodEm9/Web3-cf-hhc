import { ethers } from "./ethers-5.6.esm.js" 
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectBtn")
const fundBtn = document.getElementById("fund")
const balanceBtn = document.getElementById("balanceBtn")
const withdrawBtn = document.getElementById("withrawBtn")


const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
        // console.log("I found a metmamask")
       await window.ethereum.request({ method: "eth_requestAccounts" })
       connectButton.innerHTML = "connected"
    } else {
        connectButton.innerHTML = "Please install metamask!"
    }
}

const withdraw = async () => {
    if(typeof window.ethereum !== "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error) 
        }
    }else {
        withdrawBtn.innerHTML = "Please install metamask"
    }
}

// Fund
const fund = async ()  => { 
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Fund with ${ethAmount}`)
    if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount)
        })
          await listenForTransactionMine(transactionResponse, provider)
           console.log("Done!")
        }catch (error) {
        console.log(error)
      }
    }
 }

 const listenForTransactionMine = (transactionResponse, provider) => {
    console.log(`Mining ${transactionResponse.hash}`)
    // listen for this transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        } )
    })
 } 

const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

connectButton.addEventListener("click", (e) => {
    e.preventDefault()
    connect()
})

fundBtn.addEventListener("click", (e) => { 
    e.preventDefault() 
    fund()
})

balanceBtn.addEventListener("click", (e) => { 
    e.preventDefault() 
    getBalance()
})

withdrawBtn.addEventListener("click", (e) => { 
    e.preventDefault() 
    withdraw()
})


// Withdraw