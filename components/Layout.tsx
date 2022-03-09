import React, { useState, useEffect, VoidFunctionComponent } from "react";
import { DataContext, useDataContext } from "./../context/Context";
import NavBar from "./NavBar";
import Head from "next/head";
import Web3 from "web3";
import Login from "./Login";
import styles from '../styles/Home.module.css'
import Image from 'next/image'
// import ABI from "./../utils/WavePortal.json";
import ABI from "./../utils/ContractAbi.json";
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

  const [balance, setBalance] = React.useState<string | number>("0");

  const [popAlert, setPopAlert] = React.useState<boolean>(false);


  const NETWORKS : any= {
    1: "Ethereum Main Network",
    3: "Ropsten Test Network",
    4: "Rinkeby Test Network",
    5: "Goerli Test Network",
    42: "Kovan Test Network",
    1337: "Private Network",
  };

  // const contractAddress = "0x5e575Dd4b4A30dF3E0401360Bd7269bd110B3E98";

  const tokenContractAddress = "0x822480D4eFD781C696272F0aca9980395Db72cc0";

  // const walletAddress = "0x9CC25f58259FB1568aD7A59131c918c53d533ec5";

  const contractABI: any = ABI.abi;
  


  //loadBlockChainData
  const onLogin  = async (provider: any) => {

    const web3 = new Web3(provider) || new Web3(Web3.givenProvider);
    
    console.log("provider", provider);

    const accounts = await web3.eth.getAccounts();
    const chainId = await web3.eth.getChainId();
    if (accounts.length === 0) {
      console.log("Please connect to a Wallet!");

    } else if (accounts[0] !== web3Account) {
      setProvider(provider);
      setWeb3(web3);
      setChainId(chainId);
      setWeb3Account(accounts[0]);
      
      setIsConnected(true);
      console.clear();
      console.log("connected");
    }


    
    
    // const balanceofuser = await waveContract.methods
    // .balanceOf(web3Account)
    // .call();
  

    // const accBalanceEth = web3.utils.fromWei(
    //    await web3.eth.getBalance(web3Account),
    //    "ether"
    //  );
 
  
    // const balanceofuserinwei = await web3.utils.fromWei(
    //   balanceofuser,
    //   "ether"
    // );

    // const getBalance = () => provider.request({
    //   method: 'eth_getBalance',
    //   params: [web3Account]
    // }).then(setBalance)

    // var x = web3.eth.getBalance(web3.eth.coinbase).toNumber();
    // console.log(web3.fromWei(x, "ether").toString());

  };


  const readValues = async () => {
    var web3: Web3  = window["web3"];
    // var Web3: any = window["Web3"];
      // Arg [0] : _stablecoin (address): 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
  // Arg [1] : name (string): AlgoPool YieldNFT
  // Arg [2] : symbol (string): yNFT
  // Arg [3] : _avscoin (address): 0x94d916873b22c9c1b53695f1c002f78537b9b3b2

    // var web3 = new Web3(Web3.currentProvider || "ws://localhost:8545");
    
    var web3 = new Web3(web3.currentProvider || "ws://localhost:8545");

    // web3.setProvider(new Web3.currentProvider)

    // web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));


  // // The contract variables are declared.
  // const contract = new web3.eth.Contract(
  //   contractABI,
  //   tokenContractAddress
  //   );

  //   const result:string = await contract.methods.totalSupply().call(); 
    
  //   const format = web3.utils.fromWei(result, "ether"); 
  //   console.log(format);

  //   // balance
  //   web3.eth.getBalance("0x822480D4eFD781C696272F0aca9980395Db72cc0", function(err, result) {
  //     if (err) {
  //       console.log(err)
  //     } else {
  //       console.log(web3.utils.fromWei(result, "ether") + " ETH")
  //     }
  //   })
  }
  

  readValues();
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
  
    const reLoad = async () => {

        // Check if browser is running Metamask
        let web3: any;
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        };

        // Check if User is already connected by retrieving the chanId and accounts
      
        web3.eth.getAccounts()
            .then(console.log);
        // web3.eth.getAccounts()
        //     .then(async (addr: string) => {
        //         // Set User account into state
        //         setWeb3Account(addr);    
        //     });

        const parseChainId = (chainId: string) : number => {
					return NETWORKS[Number.parseInt(chainId, 16)]
				}

       const ntwrkId =  await web3.eth.net.getId()

        // Checking if network is an Ethereum Mainnet or Testnet
        Object.keys(NETWORKS).forEach(function(key) {
          if (NETWORKS[key] !== 1 || 3 || 4 || 5 || 42) {
            setChainId(ntwrkId);
          } else {
            setChainId(parseChainId(ntwrkId));
          }
        })

        web3.eth.getAccounts(function(err: string, accounts: string[]) {
          if (err != null) console.error("An error ocurred: "+err);
          else if (accounts.length == 0) console.log("User is not logged in to MetaMask");
          else {
            const account = accounts[0];
				    console.log(account);
            setIsConnected(true);
				    setWeb3Account(account);
            console.log("User is logged in to MetaMask");}
        })
      }  
      reLoad()   

}, []); 


// Handle Accounts and ChainId change.
  React.useEffect(() => {
    // you have to write code to detect provider.
    const web3 = new Web3(provider) || new Web3(Web3.givenProvider);

    const handleAccountsChanged = async (accounts: Array<string>) => {

      accounts = await web3.eth.getAccounts(); 
      if (accounts.length === 0) {
        setIsConnected(false);
        window.alert("There is no connected accounts. Please, connect at least 1 account in your wallet.");
        console.log("There is no connected accounts. Please, connect at least 1 account in your wallet.");
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
        return NETWORKS[Number.parseInt(chainId, 10)]
      }
      // window.location.reload();
      if ((parseChainId(web3ChainId)) == NETWORKS[1]) {
        setNetworkId(networkId);
        window.alert(`App network (Etheruem) matches the network selected in wallet. Network with id: ${networkId}`);
      } else if ((parseChainId(web3ChainId)) ==  NETWORKS[3] || NETWORKS[4] || NETWORKS[5] || NETWORKS[42]) {
        setNetworkId(networkId);
        // setPopAlert(!popAlert);
        console.log("show Popup Alert");
        window.alert(`App network (Etheruem mainnet) doesn't match to network selected in wallet. Network with id: ${networkId}`);
      } else {
        setNetworkId(networkId);
        // setPopAlert(!popAlert);
        console.log("show Popup Alert");
        window.alert(`App network (Etheruem) doesn't match tthe unknown network selected in wallet. Network with id: ${networkId}`);
        
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
  

  const value = {web3Account, balance, setIsConnected, isConnected, setWeb3Account,setChainId, isChainId, isConnecting, setIsConnecting, showWalletModal, setShowWalletModal, NETWORKS, switchEthereumChain, popAlert, web3NetworkId, onLogin, readValues }

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
          <footer className="flex flex-1 py-3 justify-center items-center border-t-2 bottom-0">
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

