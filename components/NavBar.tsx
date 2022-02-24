import React, { useContext }  from 'react'
import Image from 'next/image'
import LogoDAPP from "./../public/assets/Dapp.svg"
import { DataContext } from '../context/Context';


const NavBar = () => {


const {web3Account, isChainId, isConnected} = useContext(DataContext);

  return (
      <div className="nav-links flex bg-orange-100 px-6 justify-between	items-center">
        <div className='border-2	border-red-300 rounded'>
          <Image src={LogoDAPP} alt="logo" height={50} width={50}/>
        </div>
       
        {isConnected ? (
          <div className="actions">
                <p className='text-sm font-bold'> currentAccount: <span className='text-orange-700'>{web3Account?.substring(0, 10)}...</span></p>
                <p className='text-sm font-bold'>currentNetwork: <span className='text-orange-700'>{isChainId}</span></p>
          </div>
        ) :
        <p className=''>Not connected</p>
        }
    </div>
  )
}

export default NavBar