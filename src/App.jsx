import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import contractAbi from './utils/contractAbi.json';
import { networks } from './utils/networks';
import './App.css';
import chainlinkLogo from './assets/chainlinklogo.png';
import reactLogo from './logo.svg';
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';


const CONTRACT_ADDRESS = "0x6f71F58a56FBF14b7229028F11fcC16e0f97226f";


  const App = () => {
    const [network, setNetwork] = useState('');
    const [currentAccount, setCurrentAccount] = useState('');
  
    
    let balance = 107;
  
  
    const switchNetwork = async () => {
      if (window.ethereum) {
        try {
          // try to switch to mumbai testnet
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
             params: [{ chainId: '0x13881' }], // check networks.js for network ids
            });
          } catch (error) {
          // this error code means that the wanted chain has not yet been added to MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {	
                chainId: '0x13881',
                chainName: 'Polygon Mumbai Testnet',
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                nativeCurrency: {
                  name: "Mumbai Matic",
                    symbol: "MATIC",
                    decimals: 18
                },
                blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
              },
                  ],
          });
        } catch (error) {
          console.log(error);
        }
      }
            console.log(error);
          }
        } else {
        // if window.ethereum is not found then MetaMask is not installed
        alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
        } 
      };
  
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          alert("Get MetaMask -> https://metamask.io/");
          return;
        }
  
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
        // prints public address after authorizing Metamask
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    };
  
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
  
      const accounts = await ethereum.request({ method: 'eth_accounts' });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
  
      // check user's network chain ID
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      setNetwork(networks[chainId]);
  
      ethereum.on('chainChanged', handleChainChanged);
      
      // reload page when network is changed
      function handleChainChanged(_chainId) {
        window.location.reload();
      }
    };

    // render methods (thank you Bare Tree Media for the gif!)
	const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
			<img src="https://media1.giphy.com/media/jS24DCLRem1CXjGMJ6/giphy.gif" alt="Bare Tree Media cactus gif" />
			<h3>  </h3>
			<button onClick={connectWallet} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
  	);


	// if not on Mumbai, render "Please relocate to Polygon's Mumbai Testnet."
	const renderNetworkButton = () =>{
		if (network !== 'Polygon Mumbai Testnet') {
			return (
				<div className="connect-wallet-container">
					<h2>Please switch to Polygon's Mumbai Testnet.</h2>
					<button className='cta-button network-button' onClick={switchNetwork}>click here to relocate</button>
				</div>
			);
		}
	};

  // routing information  

  const menu_options = [
    { name: 'Create', link: '/create' },
    { name: 'Browse', link: '/browse' },
    { name: 'Manage', link: '/manage' },
    { name: 'PolygonID Demo', link: '/polygonID' },
  ];
  

  const renderMenu = () => {
    return menu_options.map((mb, index) => {

      const { name, link } = mb;
      
      return (
        <Link to={link} key={index} className="menu-item">
          <span className="item-text">{name}</span>
        </Link>
      );
    });
  };


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])




  return (
    <div className="App">
      <div className="container">

        <div className="header-container">
        <header>

        <div className="right">
          <button onClick={connectWallet} className="lil-button">
          <img alt="Network logo" className="logo" src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
                    { currentAccount ? <p className="p-lil-button"> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p className="p-lil-button"> Not connected </p> }
        
          </button>
        </div>

        </header>
        </div>


        <div className="welcome">
          <p className="title">🌵 CactuStipend 🌵</p>
          <p className="subtitle">A unique stipend adjusted for inflation.</p>
        </div>

        {!currentAccount && renderNotConnectedContainer()}
        {currentAccount && renderNetworkButton()}
        {(currentAccount && (network == 'Polygon Mumbai Testnet')) && renderMenu()}


        <div className="bottom1">

        <img src={chainlinkLogo} className="App-logo" alt="logo" />
        <p>
         Powered by Chainlink & Truflation.
        </p>
        <img src={chainlinkLogo} className="App-logo" alt="logo" />
        </div>
        <div className="bottom2">
          <p> Built on Polygon by Cactoid & Frost.</p>
          <h5>Chainlink Hackathon Fall 2022</h5>
        </div>

        </div>

    </div>
  );
}

export default App;

