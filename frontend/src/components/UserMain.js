import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './User.css';
import { useRecoilState } from "recoil";
import {currentAccountCommon,
        displayCommon,
        tokenIdCommon,
        ethValueCommon,
        balanceCommon,
        subscribeStatusCommon,
        walletAddressCommon,
        walletBalanceCommon,
      } from './UserStates'

const App = () => {
  const [currentAccount, setCurrentAccount] = useRecoilState(currentAccountCommon)
  const [balance, setBalance] = useRecoilState(balanceCommon)
  const [tokenId, setTokenId] = useRecoilState(tokenIdCommon)
  const [ethValue, setEthValue] = useRecoilState(ethValueCommon)
  const [subscribeStatus, setSubscribeStatus] = useRecoilState(subscribeStatusCommon)
  const [walletAddress, setWalletAddress] = useRecoilState(walletAddressCommon)
  const [display, setDisplay] = useRecoilState(displayCommon)

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
    setWalletAddress(accounts[0]);
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
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

  useEffect(() => {
    checkIfWalletIsConnected()
    getBalance()
  })

  return (
    <div className="Main">
      <p className="header gradient-text">Pay3 User Console
      </p>
      <p className="explain-text">
        Pay3 is a lightweight subscription payment solution
      </p>
      <div className="list-container">
        <ul>
          <li className="list-item">Minted Wallet Number: {tokenId}</li>
          <li className="list-item">Charged ETH Value: {ethValue}</li>
          <li className="list-item">Subscribe Status: {subscribeStatus? "ON": "OFF"}</li>
        </ul>
      </div>
      <div className="list-container">
        <ul>
          <li className="list-item">Connected Wallet: {walletAddress}</li>
          <li className="list-item">Balance: {balance}</li>
        </ul>
      </div>
        <div>
          <span style={{ color: "white", fontSize: "20px" }}> 
          Status:
          </span>
          <p/>
          <textarea
            className="status-box"
          />
          <p/>
        </div>
        <div className="footer-container">
        </div>
      </div>
  );
}

export default App;
