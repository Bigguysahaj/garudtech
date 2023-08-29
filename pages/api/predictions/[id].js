import Replicate from "replicate";

export default async function handler(req, res) {

  const replicate = new Replicate({
    auth: req.headers.authorization,
  });
  
  const prediction = await replicate.predictions.get(req.query.id);

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.end(JSON.stringify(prediction));
}
