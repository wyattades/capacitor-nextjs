import React from "react";

import Link from "components/Link";

const Nav = () => {
  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/items/my_cool_item">My Item</Link>
      <Link href="/things/my_neat_thing">My Thing</Link>
      <Link href="/statics/foo">Static foo</Link>
      <Link href="/statics/does_not_exist">Static DNE</Link>

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
