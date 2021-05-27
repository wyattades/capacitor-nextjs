import React from "react";

import Layout from "components/Layout";

/**
 * Thing page uses `getServerSideProps` with a dynamic url param (`thing_id`)
 */

export const getServerSideProps = async ({ params, query }) => {
  const thingId = params?.thing_id ?? query.thing_id;

  // fake delay
  await new Promise((r) => setTimeout(r, 1000));

  return {
    props: {
      content: "COOL " + thingId + " " + Date.now(),
    },
  };
};

const ThingPage = ({ content }) => {
  return (
    <Layout>
      <h1>Thing page: {content}</h1>
    </Layout>
  );
};

export default ThingPage;
