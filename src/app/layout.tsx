import React from 'react';
import Script from 'next/script';

import { DM_Sans, Space_Mono } from 'next/font/google'

const dmSans = DM_Sans({ subsets: ['latin'] })
const spaceMono = Space_Mono({ subsets: ['latin'], weight: '400' })


import "./globals.css"


export default function Layout({children } : {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} ${spaceMono.className} `}>
        {children}
      </body>
    </html>
  )
}
