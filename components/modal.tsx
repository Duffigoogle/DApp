import  React, { useEffect, useRef } from "react";
// import { getContract } from './Helpers/contract';
import { Web3Provider } from '@ethersproject/providers';
import WalletConnectProviderr from '@walletconnect/ethereum-provider';
import WalletConnectProvider from '@walletconnect/web3-provider';
import QRCodeModal from "@walletconnect/qrcode-modal";
import detectEthereumProvider from '@metamask/detect-provider';
import WalletLink from 'walletlink';
import Web3 from "web3";
import Icon from "./icons/Icons";
import Image from "next/image";
import coinb from './../public/assets/coinbase1.svg'
import { useContext } from 'react';
import { DataContext } from "../context/Context";

// (typeof window.ethereum !== 'undefined')



const WalletModal = () => {
  	const [ web3Library, setWeb3Library ] = React.useState<any>();

	const [provider, setProvider] = React.useState(undefined);

	const [web3Provider, setWeb3Provider] = React.useState();

	const [ walletlinkProvider, setWalletlinkProvider ] = React.useState();

	const [ walletConnectProvider, setWalletConnectProvider ] = React.useState();
 
	const ref= useRef<HTMLDivElement | null >(null);

	const {showWalletModal, setShowWalletModal, isConnecting, setIsConnecting, setIsConnected, isConnected, setWeb3Account, web3Account, setChainId, NETWORKS} = useContext(DataContext)


//   const NETWORKS : any = {
//     1: "Ethereum Main Network",
//     3: "Ropsten Test Network",
//     4: "Rinkeby Test Network",
//     5: "Goerli Test Network",
//     42: "Kovan Test Network",
//     1337: "Private Network",
//   };

  React.useEffect(() => {
    const checkIfClickedOutside = (e: any) => {

      // If the menu is open and the clicked target is not within the menu,
      if (showWalletModal && ref.current && !ref.current.contains(e.target)) {
        setShowWalletModal(!showWalletModal);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

//     // Detect Provider
// 	const detectProvider = () => {
// 		let provider;
// 		if (window.ethereum) {
// 		  // Modern DApp browsers
// 		  provider = window.ethereum;
// 		} else if (window.web3) {
// 		  // Legacy dapp browsers
// 		  provider = window.web3.currentProvider;
// 		} else {
// 		  // Non-dapp browsers
// 		  console.warn("No Ethereum browser detected! Check out MetaMask");
// 		}
// 		return provider;
// 	  };

//   React.useEffect(() => {
// 	setProvider(detectProvider());
//   }, []);



// vanilla metamask
	const connectMetamask = async () => {

		const provider: any = await detectEthereumProvider();
		setWeb3Provider(provider);

		if (provider) {
			try {
				
				//Get the user's Ethereum accounts
				const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });

				if (accounts.length === 0) {
					console.log("Please connect to MetaMask!");
				  } else if (accounts[0] !== web3Account) {
					setWeb3Account(accounts[0])
				  }
				const account = accounts[0];
				console.log(account);
				setWeb3Account(account);


				//Detect which Ethereum network the user is connected to
				const chainId: string = await provider.request({ method: 'eth_chainId'});

				const parseChainId = (chainId: string) : number => {
					return NETWORKS[Number.parseInt(chainId, 16)]
				}

				setChainId(parseChainId(chainId));



				setIsConnected(!isConnected);
				setShowWalletModal(false);
				const library = new Web3Provider(provider, 'any');
				console.log('library');
				console.log(library);
				console.log(chainId);
				setWeb3Library(library);
				console.log("connected");
			} catch (ex) {
				console.log(ex);
			}
		} else {
		  console.log ("What's wrong?");
		}
			
	 };



	// vanilla walletconnect
	const connectWalletConnect = async () => {
		try {
			const RPC_URLS = {
				1: 'https://mainnet.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4',
				4: 'https://rinkeby.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4'
			};

			//  Create WalletConnect Provider
			const provider: any = new WalletConnectProvider({
				rpc: {
					1: RPC_URLS[1],
					4: RPC_URLS[4]
				},
				qrcode: true,
				qrcodeModalOptions: {
					mobileLinks: [
					  "rainbow",
					  "metamask",
					  "argent",
					  "trust",
					  "imtoken",
					  "pillar",
					],
				  },
				// pollingInterval: 15000
			});

			//  Enable session (triggers QR Code modal)
			await provider.enable();

			//  Create Web3 instance
			const web3 = new Web3(provider);

			setWalletConnectProvider(provider);
			const accounts: string[] = await web3.eth.getAccounts();
			const account : string = accounts[0];

			const chainId: any = await web3.eth.getChainId();

			const parseChainId = (chainId: string) : number => {
				return NETWORKS[Number.parseInt(chainId, 16)]
			  }
			setChainId(parseChainId(chainId));

			const library = new Web3Provider(provider, 'any');

			console.log('library');
			console.log(library);
			setWeb3Library(library);
			setWeb3Account(account);
			setIsConnected(!isConnected);
			console.log("connected");
			setShowWalletModal(!showWalletModal);
		} catch (ex) {
			console.log(ex);
		}
	};


	// vanilla walletconnect
	const connectWalletConnect1 = async () => {
		try {
			const RPC_URLS = {
				1: 'https://mainnet.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4',
				4: 'https://rinkeby.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4'
			};

			//  Create WalletConnect Provider
			const provider: any = new WalletConnectProvider({
				rpc: {
					1: RPC_URLS[1],
					4: RPC_URLS[4]
				},
				qrcode: true,
				qrcodeModalOptions: {
					mobileLinks: [
					  "rainbow",
					  "metamask",
					  "argent",
					  "trust",
					  "imtoken",
					  "pillar",
					],
				  },
				// pollingInterval: 15000
			});

			//  Create Web3 instance
				// const web3 = new Web3(provider);
			setWalletConnectProvider(provider);
			const accounts: string[] = await provider.enable();
			const account : string = accounts[0];

			const library = new Web3Provider(provider, 'any');

			console.log('library');
			console.log(library);
			setWeb3Library(library);
			setWeb3Account(account);
		} catch (ex) {
			console.log(ex);
		}
	};

	// vanilla coinbase
	const connectCoinbase = async () => {
		const APP_LOGO_URL = 'https://example.com/logo.png'
		const DEFAULT_ETH_JSONRPC_URL = 'https://rinkeby.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4'
		const DEFAULT_CHAIN_ID = 4

		try {
			// Initialize WalletLink
			const walletLink = new WalletLink({
				appName: 'demo-app',
				darkMode: true,
				appLogoUrl: APP_LOGO_URL,
				
			});
			
			// // Initialize a Web3 Provider object
			// const provider: any = walletLink.makeWeb3Provider(
			// 	'https://rinkeby.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4',
			// 	4
			// );


			// Initialize a Web3 Provider object
			const provider: any = walletLink.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID)


			setWalletlinkProvider(provider);
			const accounts: string[] = await provider.request({
				method: 'eth_requestAccounts'
			});

			const chainId: string = await provider.request({ method: 'eth_chainId'});

			const account = accounts[0];

			const library = new Web3Provider(provider, 'any');

			const parseChainId = (chainId: string) : number => {
				return NETWORKS[Number.parseInt(chainId, 16)]
			}

			console.log('library');
			console.log(library);
			setWeb3Library(library);
			setIsConnected(!isConnected);
			console.log("connected");
			setShowWalletModal(!showWalletModal);
			setWeb3Account(account);
			setChainId(parseChainId(chainId));

		} catch (ex) {
			console.log(ex);
		}
	};

	// const disconnectMetamask = () => {
	// 	web3Provider.disconnect();
	// 	setWeb3Provider(null);
	// }

	// const disconnectCoinbase = () => {
	// 	walletlinkProvider.close();
	// 	setWalletlinkProvider(null);
	// };

	// const disconnectWalletconnect = ()=>{
	// 	walletConnectProvider.disconnect()
	// 	setWalletConnectProvider(null);
	// }



  return ( 
    <div className="select_wallet_modal_overlay">
      <div className="select_wallet_modal-container" ref={ref}>
        <div>
          <div className="modal-top-sect">
            <p className="font-large">Select Wallet</p>
            <p className="text-smaller">
              Please select a wallet to connect to the dapp:
            </p>
          </div>
          <div
            onClick={connectMetamask}
            className="wallet-cont"
          >
            <Icon name="metamask" size={40} />
            <p className="font-larger"> Metamask </p>
          </div>
          <div
            onClick={connectWalletConnect}
            className="wallet-cont"
          >
            <Icon name="walletConnect" size={40} />
            <p className="font-larger"> ConnectWallet </p>
          </div>
          <div
            onClick={connectCoinbase}
            className="wallet-cont"
          >
            {/* <Icon name="coinbase" size={40} /> */}
			<Image src={coinb} alt="coinbase" width="40px" height="40px"/>
            <p className="font-larger">CoinBase Wallet </p>
          </div>
        </div>
        <div className="modal-bottom-sect">
          <p className="text-smaller">
            New to Ethereum network?
          </p>
            <a href='https://www.google.com'>
              <div className="flex">
                <p className="text-smallest">
                  Learn more about Crypto Wallet &nbsp;
                </p>
              </div>
            </a>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;