import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.css';
import '../styles/tailwind.css';
import { requestLocationOncePerSession } from '../utils/geo';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    requestLocationOncePerSession();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;