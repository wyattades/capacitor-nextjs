import React from "react";

import Layout from "components/Layout";

export const getServerSideProps = async ({ params }) => {
  // fake delay
  await new Promise((r) => setTimeout(r, 1000));

  return {
    props: {
      itemId: params.item_id,
    },
  };
};

const ItemPage = ({ itemId }) => {
  return (
    <Layout>
      <h1>Item page: {itemId}</h1>
    </Layout>
  );
};

export default ItemPage;
