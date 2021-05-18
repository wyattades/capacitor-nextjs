import React from "react";
import Link from "next/link";

const IndexPage = () => {
  return (
    <div>
      <h1>Hello world</h1>
      <div>
        <Link href="/about" passHref>
          <a>About</a>
        </Link>
      </div>
    </div>
  );
};

export default IndexPage;
