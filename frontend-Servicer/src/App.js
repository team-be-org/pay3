import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import myNft from './utils/Pay3.json'
import './App.css';

const CONTRACT_ADDRESS = require("./utils/contractAddress.json").contractAddress;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("")
  const [display, setDisplay] = useState("...")
  const [tokenId, setTokenId] = useState(1)
  const [ethValue, setEthValue] = useState("")
  const [balance, setBalance] = useState(0)

  // check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!")
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      console.log('window.ethereum.networkVersion', await ethereum.request({ method: 'net_version' }));
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  // get Balance for display continually
  async function getBalance() {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(currentAccount);
      if (balance) {
        setBalance(ethers.utils.formatEther(balance));
        console.log("ETH balance", ethers.utils.formatEther(balance));
      }
      console.log("ETH balance", ethers.utils.formatEther(balance));
    } else {
      console.log("Ethereum object doesn't exist");
    }
  }


  // Charge ETH to virtual wallet
  const ChargeExecution = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer)

        if(!ethValue){
          setDisplay("no eth value")
          return
        }
        console.log("ethValue", ethValue)
        const options = {value: ethers.utils.parseEther(ethValue)}
        await connectedContract.usersendETH(tokenId, options)
        setDisplay("")
        getBalance()
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setDisplay("");
    }
  }

  // withdraw ETH from virtual wallet
  const WithdrawExecution = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer)
        await connectedContract.userWithdraw(tokenId)
        setDisplay("")
        getBalance()
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setDisplay("");
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    getBalance()
  })


  // connected wallet UI
  const renderWalletControlUI = () => (
    <div>
      <div style={{display: 'flex', justifyContent: 'center'}}></div>
        <button  className="cta-button mint-button" style={{width: "150px"}}>
          Collects
        </button>
        <button className="cta-button mint-button" style={{width: "150px"}}>
          Withdraw
        </button>
      <div/>
      <div style={{display: 'flex', justifyContent: 'center'}}>
    </div>
    </div>
  )


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Pay3 Servicer Console</p>
          <p className="explain-text">
            Pay3 is a lightweight subscription payment solution</p>
          <hr/>
          {currentAccount === "" ? null :renderWalletControlUI()}
          <p/>
          <span style={{ color: "white", fontSize: "20px" }}> 
          current Balance: {balance}
          </span>
          <textarea
            style={{ height: "200px", width: "80%", fontSize: "18px"}}
            className="text-area"
            value={display}
          />
          <p/>
        </div>
        <div className="footer-container">
        </div>
      </div>
    </div>
  );
}

export default App;
