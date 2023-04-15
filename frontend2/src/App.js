import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Modal from './components/Modal'
import twitterLogo from './assets/svgviewer-output.svg'
import openseaLogo from './assets/opensea-logo.png'
import myNft from './utils/Pay3.json'
import './App.css';

const OPENSEA_LINK = 'https://opensea.io/collection/pay3';
// const TOTAL_MINT_COUNT = 100;

//const CONTRACT_ADDRESS = "0xBCF3a2D0Ec7F39a346490e7C30163ddf6De6a268";
const CONTRACT_ADDRESS = require("./utils/contractAddress.json").contractAddress;
const ethScanContractURL = 'https://etherscan.io/address/' + CONTRACT_ADDRESS + '#writeContract';

const App = () => {
  let totalMinted = "?";
  const [currentAccount, setCurrentAccount] = useState("")
  const [miningAnimation, setMiningAnimation] = useState(false)
  const [mintTotal, setMintTotal] = useState(totalMinted)
  const [text, setText] = useState("")

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
      setupEventListener()
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

      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  const getNumberOfMinted = async () => {
    console.log("now getting number of minted")
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer);
    // let count = await connectedContract.getNumberOfMinted();
    // console.log("NumberOfMinted", count.toString())
    // setMintTotal(count.toString())
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer);

        connectedContract.on("Mint", (from, color, signature) => {
          //console.log(from, color, signature)
        })
        console.log("Setup event listener!")
      } else {
        console.log("Ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner()
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer)

          //pre check
          let isInLimit = await connectedContract.isInLimit()
          if(!isInLimit) {
            alert("You already minted upto limit")
            return;
          }

          let nftTxn;
          const options = {value: ethers.utils.parseEther("0.01")}
          nftTxn = await connectedContract.mint(text, options)
          console.log("Mining... please wait")
          setMiningAnimation(true);
          await nftTxn.wait()
          console.log(nftTxn)
          console.log(`Mined, tee transaction: https://etherscan.io/tx/${nftTxn.hash}`)
          setMiningAnimation(false)
        } else {
          console.log("Ethereum object doesn't exist")
        }
      } catch (error) {
        console.log(error)
      }
  }

  const ChargeExecution = async () => {
    // will implement later
  }

  const SubscriptionOn = async () => {
    // will implement later
  }

  const SubscriptionOff = async () => {
    // will implement later
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    getNumberOfMinted()
  })

  const handleChange = (e) => {
    setText(() => e.target.value)
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
      <button onClick={askContractToMintNft} className="cta-button mint-button">
        Mint Now
      </button>
    </div>
  )

  const renderWalletControlUI = () => (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{marginRight: '10px'}}>
        <input className="text-box" placeholder="Wallet Num" value={text} onChange={handleChange} type="text" style={{width: "150px"}}/>
      </div>
      <div style={{marginRight: '10px'}}>
        <input className="text-box" placeholder="val (ETH)" value={text} onChange={handleChange} type="text" style={{width: "100px"}} />
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
      <div style={{marginRight: '10px'}}>
        <input className="text-box" placeholder="Wallet Num" value={text} onChange={handleChange} type="text" style={{width: "150px"}}/>
      </div>
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
          {currentAccount === "" ? null :renderWalletControlUI()}
          <p/>
          {currentAccount === "" ? null :renderSubscriptionOnOffUI()}
          <p/>
          {/* <p className="sub-text">
            {mintTotal} of 100 NFTs minted.
          </p> */}
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
