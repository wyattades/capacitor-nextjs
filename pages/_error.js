import React from "react";

import Link from "components/Link";
import Layout from "components/Layout";

const ErrorPage = ({ error, code }) => {
  return (
    <Layout>
      <h1>Error page</h1>
      <p>
        Error: {code ?? error?.code} - {error?.message}
      </p>
    </Layout>
  );
};

export default ErrorPage;
