import React from "react";

import Link from "components/Link";
import Layout from "components/Layout";

const IndexPage = () => {
  return (
    <Layout>
      <h1>Index page</h1>

      <div>
        <span
          onClick={() => {
            alert("hi div");
          }}
        >
          Test span onClick
        </span>
        <br />
        <br />
        <button
          onClick={() => {
            alert("hi div");
          }}
        >
          Test button onClick
        </button>
        <br />
        <br />
        <a
          onClick={(e) => {
            e.preventDefault();
            alert("hi anchor");
          }}
        >
          Test anchor onClick
        </a>
      </div>
    </Layout>
  );
};

export default IndexPage;
