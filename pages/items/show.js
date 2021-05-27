import React from "react";

import Layout from "components/Layout";

/**
 * Thing page uses `getServerSideProps` with a `rewrite`:
 * e.g. /items/show?item_id=foo_bar  ->  /items/foo_bar
 */

export const getServerSideProps = async ({ params, query }) => {
  const itemId = params?.item_id ?? query.item_id;

  // fake delay
  await new Promise((r) => setTimeout(r, 1000));

  return {
    props: {
      content: "NEAT " + itemId + " " + new Date().toTimeString(),
    },
  };
};

const ItemPage = ({ content }) => {
  return (
    <Layout>
      <h1>Item page: {content}</h1>
    </Layout>
  );
};

export default ItemPage;
