import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import myNft from '../utils/Pay3.json'
import './App.css';

const CONTRACT_ADDRESS = require("../utils/contractAddress.json").contractAddress;

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

  // mint NFT as virtual wallet
  async function mintNFT() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer)

        const options = {value: ethers.utils.parseEther("0.01")}
        setDisplay("start minting...")
        let response = await connectedContract.mint(options)
        setDisplay("mint finished")
        getBalance()
        console.log(`tokenId: ${response}`);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setDisplay("error");
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
        setDisplay("charge finished")
        getBalance()
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setDisplay("error");
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
        setDisplay("charge finished")
        getBalance()
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setDisplay("error");
    }
  }

  // Set subscription state
  const SubscriptionOnOff = async (state) => {
    const { ethereum } = window;
    if (!ethereum) {return}
    try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer)
        await connectedContract.subscribe(tokenId, state)
        const stateStr = state?  "subscription state ON " : "subscription state OFF"
        setDisplay(stateStr)
    } catch (error) {
      console.log(error);
      setDisplay("error");
    }
  }

  const SubscriptionOn = async () => {
    await SubscriptionOnOff(true)
  }
  const SubscriptionOff = async () => {
    await SubscriptionOnOff(false)
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    getBalance()
  })

  const handleChange = (e) => {
    setTokenId(() => e.target.value)
  }

  const handleEthValueChange = (e) => {
    setEthValue(() => e.target.value)
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <div>
      <p className="sub-text">
      </p>
      <button onClick={mintNFT} className="cta-button mint-button">
        Mint Now
      </button>
    </div>
  )

  // connected wallet UI
  const renderWalletControlUI = () => (
    <div>
      <div style={{marginRight: '10px'}}>
      <span style={{ color: "white", fontSize: "20px" }}> Charge Value: </span>
        <input className="text-box" placeholder="val (ETH)" value={ethValue} onChange={handleEthValueChange} type="text" style={{width: "100px"}} />
      </div>
      <p/>
      <div style={{display: 'flex', justifyContent: 'center'}}></div>
        <button onClick={ChargeExecution} className="cta-button mint-button" style={{width: "150px"}}>
          Charge
        </button>
        <button onClick={WithdrawExecution} className="cta-button mint-button" style={{width: "150px"}}>
          Withdraw
        </button>
      <div/>
      <span style={{ color: "white", fontSize: "20px", marginTop: "30px" }}> Subscription switch</span>
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <div>
        <button onClick={SubscriptionOn} className="cta-button mint-button" style={{width: "150px"}}>
          On
        </button>
        <button onClick={SubscriptionOff} className="cta-button mint-button"  style={{width: "150px"}}>
          Off
        </button>
      </div>
    </div>
    </div>
  )


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Pay3 User Console</p>
          <p className="explain-text">
            Pay3 is a lightweight subscription payment solution</p>
          {currentAccount === "" ? renderNotConnectedContainer() :renderMintUI()}
          <hr/>
          <div style={{marginRight: '10px'}}>
          <span style={{ color: "white", fontSize: "20px" }}> Wallet Number: </span>
          <input className="text-box" placeholder="Wallet Num" value={tokenId} onChange={handleChange} type="text" style={{width: "150px"}}/>
          <p/>
        </div>
          {currentAccount === "" ? null :renderWalletControlUI()}
          <p/>
          <span style={{ color: "white", fontSize: "20px" }}> 
          current Balance: {balance}
          </span>
          <p/>
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
