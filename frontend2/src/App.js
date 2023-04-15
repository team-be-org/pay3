import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Modal from './components/Modal'
import openseaLogo from './assets/opensea-logo.png'
import myNft from './utils/Pay3.json'
import './App.css';

const OPENSEA_LINK = 'https://opensea.io/collection/pay3';
const CONTRACT_ADDRESS = require("./utils/contractAddress.json").contractAddress;
const ethScanContractURL = 'https://etherscan.io/address/' + CONTRACT_ADDRESS + '#writeContract';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("")
  const [miningAnimation, setMiningAnimation] = useState(false)
  const [display, setDisplay] = useState("...")
  const [tokenId, setTokenId] = useState(1)
  const [ethValue, setEthValue] = useState("")

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
      //setupEventListener()
      // getNumberOfMinted()
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

      //setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

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
        console.log(`tokenId: ${response}`);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setDisplay("error");
    }
  }

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
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setDisplay("error");
    }
  }

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

  const renderWalletControlUI = () => (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{marginRight: '10px'}}>
        <input className="text-box" placeholder="val (ETH)" value={ethValue} onChange={handleEthValueChange} type="text" style={{width: "100px"}} />
      </div>
      <div>
        <button onClick={ChargeExecution} className="cta-button mint-button">
          Charge
        </button>
      </div>
    </div>
  )

  const renderSubscriptionOnOffUI = () => (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div>
        <button onClick={SubscriptionOn} className="cta-button mint-button">
          On
        </button>
        <button onClick={SubscriptionOff} className="cta-button mint-button">
          Off
        </button>
      </div>
    </div>
  )

  return (
    <div className="App">
      {
        miningAnimation ? (
          <Modal />
        ) : null
      }
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Pay3</p>
          <p className="explain-text">
            Pay3 is a lightweight subscription payment solution</p>
          {currentAccount === "" ? renderNotConnectedContainer() :renderMintUI()}
          <hr/>
          <div style={{marginRight: '10px'}}>
          wallet num:
          <input className="text-box" placeholder="Wallet Num" value={tokenId} onChange={handleChange} type="text" style={{width: "150px"}}/>
          <p/>
        </div>
          {currentAccount === "" ? null :renderWalletControlUI()}
          <p/>
          {currentAccount === "" ? null :renderSubscriptionOnOffUI()}
          <p/>
          {/* <p className="sub-text">
            {mintTotal} of 100 NFTs minted.
          </p> */}
          <textarea
            style={{ height: "200px", width: "80%"}}
            className="text-area"
            value={display}
          />
          <p/>
          <a
            className="opensea-button"
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <img src={openseaLogo} alt="opensea-logo" className="opensea-logo" />View on OpenSea</a>
          <p className="explain-text">
          <br/><a href={ethScanContractURL} target="_blank" rel="noreferrer">直コンはここ</a>
          </p>
        </div>
        <div className="footer-container">
          {/* {currentAccount !== "" ?
            (<text className='footer-text' onClick={DisconnectWallet}>disconnect wallet</text>)
            :
            ("...")
          } */}
        </div>
      </div>
    </div>
  );
}

export default App;
