import { createContext, useContext } from "react";

interface DataState {
  balance?: string | number;
  getBalance?: any;
  readValues: any;
  setIsConnected: any;
  isConnected : boolean;
  web3Account? : string;
  setWeb3Account : any;  
  setChainId : any;
  isChainId: any;
  isConnecting: boolean;
  setIsConnecting: any;
  showWalletModal: boolean;
  setShowWalletModal: any;
  NETWORKS: any;
  switchEthereumChain: any;
  popAlert: boolean;
  web3NetworkId: number | string,
  onLogin: any,
}

const dataContextDefaultValues: DataState = {
  web3Account: "",
  balance: "",
  getBalance: () => {},
  readValues: () => {},
  setIsConnected: () => {},
  isConnected : false,
  setWeb3Account : () => {},  
  setChainId :() => {},
  isChainId: undefined,
  isConnecting: false,
  setIsConnecting: () => {},
  showWalletModal: false,
  setShowWalletModal: () => {},
  NETWORKS: {},
  switchEthereumChain: () => {},
  popAlert: false,
  web3NetworkId: "",
  onLogin: () => {}
}
export const DataContext = createContext<DataState>(dataContextDefaultValues);

export const useDataContext = () => {
  return useContext(DataContext);
};