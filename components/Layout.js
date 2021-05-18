import React from "react";

import Nav from "components/Nav";

const Layout = ({ children }) => {
  return (
    <div>
      <Nav />
      <hr />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
