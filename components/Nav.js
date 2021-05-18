import React from "react";

import Link from "components/Link";

const Nav = () => {
  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/items/my_cool_item">My Item</Link>

      <style jsx>{`
        div {
          display: flex;
        }

        div > :global(*) {
          margin-right: 16px;
        }
      `}</style>
    </div>
  );
};

export default Nav;
