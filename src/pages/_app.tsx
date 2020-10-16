import React from "react";
import Head from "next/head";
import { AuthProvider } from "lib/auth";
import { SWRConfig } from "swr";
import fetcher from "utils/fetcher";
import { ChakraProvider } from "@chakra-ui/core";
import theme from "../theme";
import type { AppProps } from "next/app";
import Header from "@/components/layout/header";

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Pinki</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <AuthProvider>
      <SWRConfig value={{ fetcher }}>
        <ChakraProvider resetCSS theme={theme}>
          <Header />
          <Component {...pageProps} />
        </ChakraProvider>
      </SWRConfig>
    </AuthProvider>
  </>
);

export default App;
