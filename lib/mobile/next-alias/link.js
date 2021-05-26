import React from "react";

import { useRouter } from "./router";

const Link = ({ href, children, passHref }) => {
  const router = useRouter();

  const onClick = (e) => {
    console.log("link go to:", href);
    e.preventDefault();
    router.push(href);
    return false;
  };

  return React.cloneElement(children, {
    onClick,
    ...(passHref ? { href } : {}),
  });
};

export default Link;
