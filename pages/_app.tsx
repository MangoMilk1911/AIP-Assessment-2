/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { AppProps } from 'next/app';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />;

export default MyApp;
