import React, { useEffect } from "react";
import { Dialog } from "@capacitor/dialog";

import Link from "components/Link";
import Layout from "components/Layout";

const IndexMobilePage = () => {
  return (
    <Layout>
      <h1>Index page</h1>

      <p>This is a mobile app</p>

      <div>
        <button
          onClick={() => {
            Dialog.alert({
              title: "I'm a dialog!",
              message: "what a fun message",
            });
          }}
        >
          Show a native "dialog"
        </button>
      </div>
    </Layout>
  );
};

export default IndexMobilePage;
