export const encodeQuery = (obj, withQueryPrefix = false) => {
  const str = [];
  for (const key in obj) {
    const value = obj[key];
    if (value != null)
      str.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }

  const joined = str.join("&");

  return withQueryPrefix && joined.length > 0 ? `?${joined}` : joined;
};

export const decodeQuery = (str = "") => {
  const start = str.indexOf("?");
  if (start >= 0) str = str.substr(start + 1);

  if (/^https?:\/\//.test(str)) return {};

  let match;
  const search = /([^&=]+)=?([^&]*)/g;

  const obj = {};
  while ((match = search.exec(str))) {
    obj[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  }

  return obj;
};
