

import '../variables.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'
import { Inter } from 'next/font/google';

// import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from 'next/navigation';

import Footer from '../components/footer';
import Header from '../components/header';
import React, { useEffect, useLayoutEffect } from 'react';
import { getResultsHTML } from '@/src/apis/getData';

import Loader from "@/src/components/loader";
import Cookies from 'universal-cookie';

// import NextNProgress from 'nextjs-progressbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'F1 Results',
  description: 'F1 Results crawled from www.formulaf1.com main page',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookies = new Cookies();
  // useEffect(()=>{
    cookies.set('isLoading', false, { path: '/' })
  // },[])

  return (
    <html lang="en">
      <head>
        <title>F1 Results</title>

      </head>
      <body className={inter.className}>
        {/* <NextNProgress/> */}
        <Header/>
          {children}
          
        <Footer/>
        </body>
    </html>
  )
}
