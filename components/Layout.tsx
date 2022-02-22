import React, { useState, useEffect, VoidFunctionComponent } from "react";
import NavBar from "./NavBar";
import Head from "next/head";
import Web3 from "web3";
import Login from "./Login";
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import ABI from "./../utils/WavePortal.json";
import detectEthereumProvider from '@metamask/detect-provider';
// import contractAbi from "../../utils/contractAbi.json";
// import Avs from '../../utils/AvsAbi.json';


// if (typeof window !== 'undefined') {
//   // You now have access to `window`
// }

const contractAddress = "0x5e575Dd4b4A30dF3E0401360Bd7269bd110B3E98";

const contractABI: any = ABI.abi;

type Props = { children: React.ReactNode };

const Layout: React.FC<Props> = ({children}) => {
 
  let isWindow = typeof window !== "undefined" && typeof window.ethereum !== "undefined";

  const [currentAccount, setCurrentAccount] = React.useState<string>("");
  const [isConnected, setIsConnected] = React.useState(false);
  // const [provider, setProvider] = React.useState(isWindow ? window?.ethereum : {});
  const [provider, setProvider] = React.useState<any>();
  const [ web3Account, setWeb3Account ] = React.useState<string>("");

  const [isChainId, setChainId] = React.useState(undefined as any);  

  const [web3, setWeb3] = React.useState<any>(null);


  const NETWORKS : any = {
    1: "Ethereum Main Network",
    3: "Ropsten Test Network",
    4: "Rinkeby Test Network",
    5: "Goerli Test Network",
    42: "Kovan Test Network",
    1337: "Private Network",
  };

  //loadBlockChainData
  const onLoginHandler = async () => {
    const provider = await detectEthereumProvider();
  
    if (provider) {
      onLogin(provider);
    } else {
      console.log ("Please install Metamsk");
    }

    // setIsConnecting(true);
    // await provider.request({
    //   method: "eth_requestAccounts",
    // });
    // setIsConnecting(false);
  };
  const onLogin  = async (provider: any) => {
    const web3 = new Web3(provider) || new Web3(Web3.givenProvider);
    // isWindow && window?.ethereum.enable();

    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?');
    }
    console.log("provider", provider);
    const accounts = await web3.eth.getAccounts();
    const chainId = await web3.eth.getChainId();
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask!");
    } else if (accounts[0] !== currentAccount) {
      setProvider(provider);
      setWeb3(web3);
      setChainId(chainId);
      setCurrentAccount(accounts[0]);

      // const accBalanceEth = web3.utils.fromWei(
      //   await web3.eth.getBalance(accounts[0]),
      //   "ether"
      // );

      // setBalance(Number(accBalanceEth).toFixed(6));
      setIsConnected(true);
      console.clear();
      console.log("connected");
    }

    const networkId = await web3.eth.net.getId();

     // The contract variables are declared.
   const waveContract = new web3.eth.Contract(
    contractABI,
    contractAddress
  );
  

    const balanceofuser = await waveContract.methods
      .balanceOf(accounts[0])
      .call();
      
    // const balanceofuserinwei = await web3.utils.fromWei(
    //   balanceofuser,
    //   "ether000"
    // );

     const accBalanceEth = web3.utils.fromWei(
        await web3.eth.getBalance(accounts[0]),
        "ether"
      );
   
  };

  const onLogout = () => {
    setIsConnected(false);
    setCurrentAccount("");
  };

  // useEffect(() => {
  //   const handleAccountsChanged = async (accounts: string | any[]) => {
  //     const web3Accounts = await web3.eth.getAccounts();
  //     if (accounts.length === 0) {
  //       onLogout();
  //     } else if (accounts[0] !== currentAccount) {
  //       setCurrentAccount(accounts[0]);
  //     }
  //   };

  //   const handleChainChanged = async (chainId: any) => {
  //     const web3ChainId = await web3.eth.getChainId();
  //     setChainId(web3ChainId);
  //   };

  //   if (isConnected) {
  //     provider.on("accountsChanged", handleAccountsChanged);
  //     provider.on("chainChanged", handleChainChanged);
  //   }

  //   return () => {
  //     if (isConnected) {
  //       provider.removeListener("accountsChanged", handleAccountsChanged);
  //       provider.removeListener("chainChanged", handleChainChanged);
  //     }
  //   };
  // }, [isConnected]);

  



  const getCurrentNetwork = (chainId: any) => {
    return NETWORKS[chainId];
  };

  return (
    <div className="">
      <Head>
        <title>DAPP DEMO</title>
        <meta name="description" content="Demo-Homepage" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="h-screen box-border	">
      <NavBar
        // onLogin={onLogin}
        web3Account={web3Account}
        isConnected={isConnected}
        isChainId={isChainId}
      />
      <main className="children">
          {!isConnected && (
            <Login
              onLogin={onLogin}
              setIsConnected={setIsConnected}
              onLoginHandler={onLoginHandler}
              isConnected={isConnected}
              setWeb3Account={setWeb3Account}
              setChainId={setChainId}
            />
          )}
          {isConnected && (
            <div>
              {children}
            </div>
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
    </div>
  );
};

export default Layout;

