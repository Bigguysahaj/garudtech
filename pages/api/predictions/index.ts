
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
    version: "b96a2f33cc8e4b0aa23eacfce731b9c41a7d9466d9ed4e167375587b54db9423",
    
    input: {image : img, prompt},

  });


  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
