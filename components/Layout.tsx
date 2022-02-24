import React, { useState, useEffect, VoidFunctionComponent } from "react";
import { DataContext, useDataContext } from "./../context/Context";
import NavBar from "./NavBar";
import Head from "next/head";
import Web3 from "web3";
import Login from "./Login";
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import ABI from "./../utils/WavePortal.json";
import detectEthereumProvider from '@metamask/detect-provider';


type Props = { children: React.ReactNode };

const Layout = ({children}: Props) => {
 
  let isWindow = typeof window !== "undefined" && typeof window.ethereum !== "undefined";

  const [showWalletModal, setShowWalletModal] = React.useState(false);

  const [isConnected, setIsConnected] = React.useState(false);

  const [isConnecting, setIsConnecting] = React.useState(false);
 
  const [provider, setProvider] = React.useState<any>(isWindow ? window?.ethereum : {});

  const [ web3Account, setWeb3Account ] = React.useState("");

  const [isChainId, setChainId] = React.useState<string | number >("");  

  const [ web3NetworkId, setNetworkId ] = React.useState<string | number>("");

  const [web3, setWeb3] = React.useState<any>();

  const [balance, setBalance] = React.useState("");

  const [showalert, setShowAlert] = React.useState(false);



  const NETWORKS : any= {
    1: "Ethereum Main Network",
    3: "Ropsten Test Network",
    4: "Rinkeby Test Network",
    5: "Goerli Test Network",
    42: "Kovan Test Network",
    1337: "Private Network",
  };


  //loadBlockChainData
  const onLogin  = async (provider: any) => {

    const web3 = new Web3(provider) || new Web3(Web3.givenProvider);

    // difference between currrentProvider and givenProvider
    
    console.log("provider", provider);

    const accounts = await web3.eth.getAccounts();
    const chainId = await web3.eth.getChainId();
    if (accounts.length === 0) {
      console.log("Please connect to a Wallet!");

    } else if (accounts[0] !== web3Account) {
      setProvider(provider);
      // setWeb3(web3);
      setChainId(chainId);
      setWeb3Account(accounts[0]);
      
      setIsConnected(true);
      console.clear();
      console.log("connected");
    }


    const contractAddress = "0x5e575Dd4b4A30dF3E0401360Bd7269bd110B3E98";

    const contractAddressA = "0x822480D4eFD781C696272F0aca9980395Db72cc0";

    const contractABI: any = ABI.abi;
    
    // The contract variables are declared.
    const waveContract = new web3.eth.Contract(
    contractABI,
    contractAddress
    );
    
    const balanceofuser = await waveContract.methods
    .balanceOf(web3Account)
    .call();
  

    const accBalanceEth = web3.utils.fromWei(
       await web3.eth.getBalance(web3Account),
       "ether"
     );
 
    const balanceofuserinwei = await web3.utils.fromWei(
      balanceofuser,
      "ether"
    );

    // const getBalance = () => provider.request({
    //   method: 'eth_getBalance',
    //   params: [web3Account]
    // }).then(setBalance)

    // var x = web3.eth.getBalance(web3.eth.coinbase).toNumber();
    // console.log(web3.fromWei(x, "ether").toString());

  };
  

  // interface SwitchEthereumChainParameter {
  //   chainId: string; // A 0x-prefixed hexadecimal string
  // }
  const switchEthereumChain  = async () => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xf00' }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      
      // 
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xf00',
                chainName: '...',
                rpcUrls: ['https://...'] /* ... */,
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
          console.log(addError);
        }
    
      // handle other "switch" errors
      console.log(switchError);
    }
  }


  React.useEffect(() => {
    // you have to write code to detect provider.
    const web3 = new Web3(provider) || new Web3(Web3.givenProvider);

    const handleAccountsChanged = async (accounts: Array<string>) => {

      accounts = await web3.eth.getAccounts(); 

      if (accounts.length === 0) {
        setIsConnected(false);
        window.alert("There is no connected accounts. Please, connect at least 1 account in your wallet.");
        // onLogout();
      } else if (accounts[0] !== web3Account) {
        setWeb3Account(accounts[0]);
      }
    };

    const handleChainChanged = async (chainId: any) => {
      const web3ChainId: number = await web3.eth.getChainId();

      const networkId: number = await web3.eth.net.getId(); 

      // converting the chainId HEX to name associated with Network
      const parseChainId = (chainId: any) : string => {
        return NETWORKS[Number.parseInt(chainId, 16)]
      }
      // window.location.reload();
      if (parseChainId(web3ChainId) != NETWORKS[1] || NETWORKS[3] || NETWORKS[4] || NETWORKS[5] || NETWORKS[42]) {
        setNetworkId(networkId);
        window.alert(`App network (Etheruem) doesn't match to network selected in wallet. Network with id: ${web3NetworkId}`);
        setShowAlert(!showalert);
      }
      setChainId(parseChainId(web3ChainId));
    };

    // listen for updates
    if (isConnected) {
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
    }

      // clean up on unmount
    return () => {
      if (isConnected) {
        provider.removeListener("accountsChanged", handleAccountsChanged);
        provider.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [isConnected]);


  // const disconnectProvider = (provider) => {
  //   // let provider;
  //   if (provider = window.ethereum) {

  //     // disconnectMetamask
  //     	ethereum.disconnect();
  //     	setWeb3Provider(null);
  //       setIsConnected(false);

  //   } else if (provider = window.web3) {

  //      //disconnectCoinbase
  //       	walletlinkProvider.close();
  //       	setWalletlinkProvider(null);
  //         setIsConnected(false);

  //   } else {

  //     // disconnectWalletconnect
  //     	walletConnectProvider.disconnect()
  //     	setWalletConnectProvider(null);
  //       setIsConnected(false);
  //   }
  // };
  

  const value = {web3Account, balance, setIsConnected, isConnected, setWeb3Account,setChainId, isChainId, isConnecting, setIsConnecting, showWalletModal, setShowWalletModal, NETWORKS, switchEthereumChain, showalert, web3NetworkId }

  return (
    <div className="">
      <Head>
        <title>DAPP DEMO</title>
        <meta name="description" content="Demo-Homepage" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <DataContext.Provider value={value}>
          <div className="h-screen box-border	">
          <NavBar />
          <main className="children">
              {isConnected ? (
                  <div>
                    {children}
                  </div>
              ) : (
                <Login />
              )}
          </main>
          <footer className={styles.footer}>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{' '}
              <span className={styles.logo}>
                <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
              </span>
            </a>
          </footer>
          </div>
      </DataContext.Provider>
    </div>
  );
};

export default Layout;

