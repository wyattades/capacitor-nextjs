import type { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  console.log("called test_api");

  res.json({
    success: true,
    time: new Date().toString(),
    query: req.query,
  });
};

export default handler;
