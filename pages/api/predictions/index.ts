
import Replicate from "replicate";

export default async function handler(req, res) {

  const replicate = new Replicate({
    auth: req.headers.authorization,
    // auth: process.env.REPLICATE_API_TOKEN,
  });

  const {prompt, img} = req.body;

  if (!req.headers.authorization) {
    throw new Error(
      "Please provide an API key. You can get one at https://replicate.com/account/api-tokens"
    );
  }

  const prediction = await replicate.predictions.create({
    version: "c4c54e3c8c97cd50c2d2fec9be3b6065563ccf7d43787fb99f84151b867178fe",
    
    input: {prompt, img},

  });


  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
