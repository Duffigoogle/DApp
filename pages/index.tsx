import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useState, useContext } from 'react';
import styles from '../styles/Home.module.css'
import LogoDAPP from "./../public/assets/Dapp.svg"
import Layout from '../components/Layout'
import { DataContext } from '../context/Context';

const Home: NextPage = (networkId) => {

  const {web3Account, getBalance, balance, switchEthereumChain, popAlert, readValues} = useContext(DataContext)

  const getTotalSuppy = () => {
    readValues();
    console.log("Wahala");
  }

  return (
    <Layout>    
      <main className="">
    
          <section className=''>
            <div className='flex justify-between'>
            {popAlert && (

              <div className='bg-red-900 flex justify-between items-center px-12 w-full flex-wrap'>
                <p className='text-sm text-white font-medium text-wrap'> `App network (Etheruem) doesn't match to network selected in wallet. Network with id: ${networkId}`
                </p>
                <button onClick={switchEthereumChain}
                className="rounded-lg my-2 px-2  bg-white hover:bg-slate-100 text-sm text-amber-700 hover:text-amber-900 min-w-fit">
                Change Network
                </button>
              </div>
            )}

              {/* <button onClick={disConnectWallet}
                className="rounded-lg mt-2 mr-8 px-4 py-2 bg-orange-700 hover:bg-orange-600 text-cyan-100">
                Disconnect
              </button> */}
            </div>
            <div className='w-fit m-auto'>
                <Image src={LogoDAPP} alt="hero_image"/>
            </div>
            <div className="mx-4 pr-2 text-center">
              <p className="text-5xl font-medium pb-5">Want anything to be easy with <span className="text-red-600">WEB3.</span></p>
              <p className="pb-3">
                Provides a network for all your needs with ease and fun using DAPPAsockets. Discover interesting features from us.
              </p>
             
              <button className="cursor-pointer   bg-amber-600 rounded-md px-10 py-3 my-9" onClick={getTotalSuppy} > Get Balance 
              </button>
              
              <p className="pb-5">Balance: {balance}</p>
            </div>
          </section>
  
      </main>
    </Layout>
  )
}

export default Home
