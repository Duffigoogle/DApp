import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import Header from '../components/Header'
import styles from '../styles/Home.module.css'
import LogoDAPP from "./../public/assets/Dapp.svg"
import Layout from '../components/Layout'

const Home: NextPage = () => {

  const getBalance = () => {

  }
  
  return (
    <Layout>    
      <main className="">
    
          <section className=''>
            <div className='w-fit m-auto'>
                <Image src={LogoDAPP} alt="hero_image"/>
            </div>
            <div className="mx-4 pr-2 text-center">
              <p className="text-5xl font-medium pb-5">Want anything to be easy with <span className="text-red-600">WEB3.</span></p>
              <p className="pb-3">
                Provides a network for all your needs with ease and fun using DAPPAsockets. Discover interesting features from us.
              </p>
             
              <button className="cursor-pointer   bg-amber-600 rounded-md px-10 py-3 my-9" onClick={getBalance}> Get Balance 
              </button>
            </div>
          </section>
  
      </main>
    </Layout>
  )
}

export default Home
