// import type {NextPage} from "next";
import { useState } from "react";
import Head from "next/head";
// import { promises as fs } from "fs";
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    
    e.preventDefault();  
    const formData = new FormData(e.currentTarget);
    const formDataObject = Object.fromEntries(
      formData.entries()
    )
    const { prompt, img } = formDataObject;

    if (!img) {
      setError("Please select an image.");
      return;
    }
    
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        img: await fileToBase64(img),
      }),
    });

    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
};

  return (
    <>
    <nav className="flex justify-content-center py-2 mb-8">
      <h1 className="text-center font-bold text-2xl">GARUD 🦅</h1>

    </nav>
    <div className="container max-w-2xl mx-auto p3">
      <Head>
        <title>Garud tech</title>
      </Head>
      <form className="w-full flex" onSubmit={handleSubmit}>
        <div className="flex justify-content-space-between">
          <div>
            <label htmlform="img">image</label>
            <input
              type="file"
              className="flex-grow mr-2 "
              name="img"
              placeholder="Drop your image here, and let garud tell you what he sees! "
            />
          </div>
          <div>
            <label htmlform="prompt">prompt</label>
            <textarea
              name="prompt"
              className="border border-gray-400 rounded-lg p-2 outline-none"
              placeholder="Drop your image here, and let garud tell you what he sees! "
            />
          </div>
        </div>
        <button className="button" type="submit">
          G0!
        </button>
      </form>


      {error && <div>{error}</div>}

      {prediction && (
        <div className="py-10">
          {prediction.output && <div>{prediction.output}</div>}
          <p className="text-sm opacity-50 pt-10">
            status: {prediction.status}
          </p>
        </div>
      )}
    </div>
    </>
  );
}
