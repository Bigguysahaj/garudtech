
import { useState, useEffect } from "react";
import Head from "next/head";
import Modal from "./components/Modal";
// import axios from "axios";

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
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    const modal = document.getElementById("modal");
    modal.style.display = "block";

    const key = sessionStorage.getItem("apiKey");
    if (key) {
      setApiKey(key);
    }
  }, []);

  const handleSubmit = async (e) => {
    
    e.preventDefault();  
    const formData = new FormData(e.currentTarget);
    const formDataObject = Object.fromEntries(
      formData.entries()
    )
    const img = formDataObject.img;
    const prompt = formDataObject.prompt;

    if (!img) {
      setError("Please select an image.");
      return;
    }
    
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
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
      const response = await fetch("/api/predictions/" + prediction.id, {
        headers: {
          Authorization: apiKey,
        },
      });
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
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
      <div>
        <Modal onClose={setApiKey} />
        {apiKey && <p>Your API key is: {apiKey}</p>}
      </div>
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
