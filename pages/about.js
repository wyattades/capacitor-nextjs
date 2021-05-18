import React from "react";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div>
      <h1>About me</h1>
      <div>
        <Link href="/" passHref>
          <a>Home</a>
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
