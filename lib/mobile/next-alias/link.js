import React from "react";

import { useRouter } from "./router";

const Link = ({ href, children, passHref }) => {
  const router = useRouter();

  const onClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return React.cloneElement(children, {
    onClick,
    ...(passHref ? { href } : {}),
  });
};

export default Link;
