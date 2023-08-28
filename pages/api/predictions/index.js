
// import { response } from "express";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// const output = await replicate.run(
//   "joehoover/instructblip-vicuna13b:c4c54e3c8c97cd50c2d2fec9be3b6065563ccf7d43787fb99f84151b867178fe",
//   {
//     input: {
//       prompt: "..."
//     }
//   }
// );


export default async function handler(req, res) {

  const {prompt, img} = req.body;

  // const response = await fetch("https://api.replicate.com/v1/predictions", {
  //   method: "POST",
  //   headers: {
  //     Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
  //     "Content-Type": "application/json",
  //   },

  //   body: JSON.stringify({
  //     version: "c4c54e3c8c97cd50c2d2fec9be3b6065563ccf7d43787fb99f84151b867178fe",

  //     input: {prompt, img},
  //   }),
  // });

  // if (response.status !== 201) {
  //   let error = await response.json();
  //   res.statusCode = 500;
  //   res.end(JSON.stringify({ detail: error.detail }));
  //   return;
  // }

  // const prediction = await response.json();
  // res.statusCode = 201;
  // res.end(JSON.stringify(prediction));



  
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }
  
  // const {prompt, img} = req.body;

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
