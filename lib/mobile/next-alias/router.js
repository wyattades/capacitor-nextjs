import { useLocation, useHistory } from "react-router-dom";

export const useRouter = () => {
  const location = useLocation();
  const history = useHistory();

  return {
    pathname: location.pathname,
    asPath: location.pathname + location.search + location.hash,
    push(href) {
      history.push(href);
    },
    replace(href) {
      history.replace(href);
    },
  };
};

// TODO
const Router = {};

export default Router;
