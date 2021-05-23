import React from "react";

import Head from "next/head";

const App = ({ pageProps, Component }) => {
  return (
    <>
      <Head>
        <title>My cool website</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default App;
