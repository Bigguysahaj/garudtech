import { useState, useEffect} from "react";
import Head from "next/head";
import { Textarea } from "../@/components/ui/textarea";
import { Label } from "../@/components/ui/label";
import { Input } from "../@/components/ui/input";
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from "../@/components/ui/button";
import Modal from "./components/ApiDialog";


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


let apiKey: string | "";

async function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  useEffect(() => {
    const modal = document.getElementById('api');
    if (modal) {
      modal.style.display = 'block';
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitApiKey = (key) => {
    apiKey = key;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formDataObject = Object.fromEntries(formData.entries());
    const img = formDataObject.img as File;
    const prompt = formDataObject.prompt as string;

    if (!img) {
      setError("Please select an image.");
      return;
    }

    if(apiKey && /^r8_/.test(apiKey)) {
      console.log(apiKey);
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
        await sleep(2000);
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
    }else{
      setError("Please add correct api key");
      return;
    }
  }

  return (
    <div>
      <nav className="flex justify-content-center text-secondary-foreground">
        <h1 className="text-center font-bold text-2xl">GARUD 🦅</h1>
        <div id="api" className="modal">
            {isModalOpen && (
            <Modal onClose={closeModal} onSubmit={handleSubmitApiKey} />
          )}
        </div>
      </nav>
      {/* </div> */}
      <div className="container max-w-2xl mx-auto p3 pt-[50px]">
        <Head>
          <title>Garud tech</title>
        </Head>
        <form className="w-full flex" onSubmit={handleSubmit}>
          <div className="flex justify-content-space-between">

            <div className="grid w-full gap-1.5 border-sm border-gray-300 shadow-sm rounded-sm ">
              <Input
                type="file"
                className="flex-grow mr-2 "
                name="img"
                placeholder="Drop your image here, and let garud tell you what he sees! "
              />
            </div>
            <div className="grid w-full gap-1.5 pl-[40px] shadow-lg" >
              <Textarea
                className="border p-2 outline-none height-20vh"
                style={{ height: "298px" }}
                placeholder="Ask questions specific to your picture, garud shall answer!"
                name="prompt"
                // id="prompt"
              />
              <p className="text-sm text-muted-foreground">
                Make sure to put add your api token, click on the api button above.
              </p>
            </div>
          </div>

          <Button className="button" type="submit" variant="outline" disabled={!apiKey}>
            G0!
          </Button>
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
    </div>
  );
}
