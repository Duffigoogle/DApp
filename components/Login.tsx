import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Web3 from "web3";
import WalletModal from "./modal";
import ABI from "./../utils/WavePortal.json";

// const ConnectWallet = ({
//   onLoginHandler,
//   showWalletModal,
//   setShowWalletModal,
//   closeModal,
// }) => {
//   const [hover, setHover] = useState(false);
//   const ref = useRef();

//   useEffect(() => {
//     const checkIfClickedOutside = (e) => {
//       // If the menu is open and the clicked target is not within the menu,
//       if (showWalletModal && ref.current && !ref.current.contains(e.target)) {
//         setShowWalletModal(false);
//       }
//     };
//     document.addEventListener("mousedown", checkIfClickedOutside);

//     return () => {
//       // Cleanup the event listener
//       document.removeEventListener("mousedown", checkIfClickedOutside);
//     };
//   }, [showWalletModal]);

//   return (
//     <div className="select_wallet_modal_overlay">
//       <div className="select_wallet_modal-container" ref={ref}>
//         <div className="">
//           <div>
//             <p className="font-large">Select a Wallet</p>
//             <p className="text-smaller">
//               Please select a wallet to connect to the dapp:
//             </p>
//           </div>
//           <button
//             onClick={onLoginHandler}
//             className="wallet-cont wallet-type flex align-center pl-2 mt-2 w-100"
//           >
//             <Icon name="metamask" size={40} />
//             <p className="font-large ml-2"> MetaMask </p>
//           </button>
//           <button className="wallet-cont wallet-type flex align-center pl-2 mt-2 w-100">
//             <Icon name="walletConnect" size={40} />
//             <p className="font-large ml-2">WalletConnect</p>
//           </button>
//         </div>
//         <div className="mt-5">
//           <p className="text-smaller text-light mb-1">
//             New to Ethereum network?
//           </p>
//           <Link href="#">
//             <a
//               onMouseEnter={() => setHover(true)}
//               onMouseLeave={() => setHover(false)}
//             >
//               <div className="flex">
//                 <p className="text-smaller">
//                   Learn more about Crypto Wallet &nbsp;
//                 </p>
//                 <Icon name={"outlink"} color={hover ? "#222222" : "#808080"} />
//               </div>
//             </a>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

const contractAddress = "0x5e575Dd4b4A30dF3E0401360Bd7269bd110B3E98";

const contractABI = ABI.abi;

const Login = ({ onLogin, setIsConnected, onLoginHandler, isConnected, setWeb3Account, setChainId
} : {
  onLogin : any,
  setIsConnected : any,
  onLoginHandler: any,
  isConnected: boolean,
  setWeb3Account: any,
  setChainId: any
}): JSX.Element => {
  const [showWalletModal, setShowWalletModal] = React.useState<boolean>(false);
  const [isConnecting, setIsConnecting] = React.useState<boolean>(false);
  const [provider, setProvider] = React.useState();
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = React.useState(false);

  const toggleWalletModal = () => {
    setShowWalletModal(!showWalletModal);
  };

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

  return (
    <>
      {window.ethereum ? (
        <div className="start_page text-center mt-40">
          <p className="mb-7 text-2xl">Connect your wallet to the application</p>
         
          <button onClick={toggleWalletModal}
            className="rounded-lg px-4 py-2 bg-orange-700 text-green-100">
            {!isConnecting && "Connect Wallet"}
            {isConnecting && "Loading...."}
          </button>
          {showWalletModal && (
              <WalletModal 
              showWalletModal={showWalletModal}
              setShowWalletModal={setShowWalletModal}
              isConnecting={isConnecting}
              setIsConnecting={setIsConnecting}
              setIsConnected={setIsConnected}
              isConnected={isConnected}
              setWeb3Account={setWeb3Account}
              setChainId={setChainId}
              />
          )}
        </div>
      ) : (
        <div>
          <p className="start_page">
            <a href="https://metamask.io/" target="_blank" rel="noreferrer">
              Install MetaMask
            </a>
          </p>
          <p className="start_page">
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
