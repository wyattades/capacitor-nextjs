export const encodeQuery = (obj, withQueryPrefix = false) => {
  const params = new URLSearchParams();

  for (const key in obj) {
    const value = obj[key];
    if (value != null) params.append(key, value);
  }

  const joined = params.toString();

  return withQueryPrefix && joined.length > 0 ? `?${joined}` : joined;
};

export const decodeQuery = (str = "") => {
  const start = str.indexOf("?");
  if (start >= 0) str = str.substr(start + 1);

  if (/^https?:\/\//.test(str)) return {};

  const params = new URLSearchParams(str);

  const obj = {};
  params.forEach((v, k) => {
    obj[k] = v;
  });

  return obj;
};
