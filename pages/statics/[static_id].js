import React from "react";

import Layout from "components/Layout";

/**
 * Thing page uses `getStaticProps` and `getStaticPaths` with
 * a dynamic url param (`static_id`)
 */

export const getStaticProps = async ({ params }) => {
  const staticId = params.static_id;

  // fake delay
  await new Promise((r) => setTimeout(r, 1000));

  return {
    props: {
      content: "STATIC " + staticId + " " + Date.now(),
    },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: ["foo", "bar"].map((static_id) => ({
      params: { static_id },
    })),
    fallback: false,
  };
};

const StaticPage = ({ content }) => {
  return (
    <Layout>
      <h1>Static page: {content}</h1>
    </Layout>
  );
};

export default StaticPage;
