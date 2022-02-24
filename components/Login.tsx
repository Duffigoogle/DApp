import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Web3 from "web3";
import WalletModal from "./modal";
import ABI from "./../utils/WavePortal.json";
import detectEthereumProvider from '@metamask/detect-provider';
import { useContext } from 'react';
import { DataContext } from "../context/Context";


const Login = ()  => {
 
  const [provider, setProvider] = React.useState<any>();

  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = React.useState(false);

  const [web3, setWeb3] = React.useState<any>();
 

  const toggleWalletModal = () => {
    setShowWalletModal(!showWalletModal);
  };

  const {setIsConnected, isConnected, setWeb3Account, web3Account, setChainId, isConnecting, setIsConnecting, showWalletModal, setShowWalletModal } = useContext(DataContext)

  // React.useEffect(() => {
  //   setProvider(detectProvider());
  // }, []);

  // React.useEffect(() => {
  //   const provider = detectProvider();
  //   if (provider) {
  //     if (provider !== window.ethereum) {
  //       console.error(
  //         "Not window.ethereum provider.  Do you have multiple wallets installed ?"
  //       );
  //     }
  //     setIsMetaMaskInstalled(true);
  //   }
  // }, []);


  React.useEffect(() => {
    const onLoginHandler = async () => {
      const provider = await detectEthereumProvider();
    
      if (provider) {
        // If the provider returned by detectEthereumProvider is not the same as
        // window.ethereum, something is overwriting it, perhaps another wallet.
        if (provider !== window.ethereum) {
          console.error(
            "Not window.ethereum provider.  Do you have multiple wallets installed ?"
          );
        }
        // onLogin(provider);
        setIsMetaMaskInstalled(true);
      } else {
        console.log ("Please install Metamsk");
        setIsMetaMaskInstalled(false);
      }
  
      // setIsConnecting(true);
      // setIsConnecting(false);
    };
    onLoginHandler();
  }, [])


  
  // const onLogout = () => {
  //   setIsConnected(false);
  //   // setWeb3Account("");
  // };
  
//   await window.ethereum.request({
//     method: "eth_requestAccounts",
//     params: [{eth_accounts: {}}]
// })


  // const getCurrentNetwork = (chainId: any) => {
  //   return NETWORKS[chainId];
  // };


  return (
    <>
      {isMetaMaskInstalled ? (
        <div className="start_page text-center mt-40">
          <p className="mb-7 text-2xl">Connect your wallet to the application</p>
          <button onClick={toggleWalletModal}
            className="rounded-lg px-4 py-2 bg-orange-700 text-green-100">
            {!isConnecting && "Connect Wallet"}
            {isConnecting && "Loading...."}
          </button>
          {showWalletModal && (
              <WalletModal />
          )}
        </div>
      ) : (
        <div>
          <p className="start_page no-underline hover:underline">
            <a href="https://metamask.io/" target="_blank" rel="noreferrer">
              Install MetaMask
            </a>
          </p>
          <p className="start_page no-underline hover:underline">
            <a href="https://www.coinbase.com/wallet/getting-started-extension" target="_blank" rel="noreferrer">
              Install CoinBase
            </a>
          </p>
        </div>
      )}
    </>
  );
};

export default Login;
