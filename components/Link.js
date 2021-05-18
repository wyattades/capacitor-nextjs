import React from "react";
import NextLink from "next/link";

// const Link = ({ href, children }) => {
//   return <a href={href}>{children}</a>;
// };

const Link = ({ href, children }) => {
  return (
    <NextLink href={href} passHref>
      <a>{children}</a>
    </NextLink>
  );
};

export default Link;
