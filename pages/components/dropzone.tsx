import React, { useState, useEffect, useRef } from 'react';
import ReactDropzone from 'react-dropzone';
// import fs from 'fs';
import path from 'path';

interface DropzoneProps {
    frameInterval: number;
    }

export default function Dropzone({ frameInterval }: DropzoneProps) {

  // useEffect(() => {
  //   import('@ffmpeg/ffmpeg').then((ffmpegModule) => {
  //     const { FFmpeg } = ffmpegModule;
  //   });
  // }, []);

  // useEffect(() => {
  //   import('@ffmpeg/util').then((ffmpegModule) => {
  //     const { toBlobURL } = ffmpegModule;
  //   });
  // }, []);

    
  const [is_hover, setIsHover] = useState<Boolean>(false);
  const [video, setVideo] = useState([]);
  const [loaded, setLoaded] = useState<Boolean>(false)
  const [isLoading, setIsLoading] = useState<Boolean>(false)
  const ffmpegRef = useRef(null); 
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const messageRef = useRef<HTMLParagraphElement | null>(null)
  
  useEffect(() => {
    import('@ffmpeg/ffmpeg').then((ffmpegModule) => {
      setIsLoading(true);
      const { FFmpeg } = ffmpegModule;
      ffmpegRef.current = new FFmpeg();
      import('@ffmpeg/util').then((utilModule) => {
        const { toBlobURL } = utilModule;
        const load = async () => {
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
            const ffmpeg = ffmpegRef.current
          ffmpeg.on("log", ({ message }) => {
          if (messageRef.current) messageRef.current.innerHTML = message
          })
          await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
          })
          setLoaded(true)
          setIsLoading(false)
        }
        load();
      });
    });
    }, [])

  const handleUpload = async (uploadedvideo) => {
    setVideo(uploadedvideo);
    setIsHover(false);
    if (uploadedvideo.length === 0) {
        return;
      }

    const videoPath = URL.createObjectURL(uploadedvideo[0]); // Assuming only one video file is uploaded
    const outputFolder = 'frames';

    // if (!fs.existsSync(outputFolder)) {
    //   fs.mkdirSync(outputFolder);
    // }

    console.log("videoPath:", videoPath);
    captureFrames(videoPath, outputFolder);
    // console.log('Frames captured:', framePaths);
  };

  const captureFrames = async (videoPath: string, outputFolder) => {
    if (!ffmpegRef.current) return [];

    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoPath));
      console.log(ffmpeg);
      
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-vf', `fps=1/${frameInterval}`,
        `frame-%03d.png`,
      ]);

      
      const frameDataArray = [];

      for (let i = 1; i <= 4; i++) {
        const frameData = await ffmpeg.readFile(`frame-${i.toString().padStart(3, '0')}.png`);
        frameDataArray.push(frameData);
      }

      const frameDataArrayString = JSON.stringify(frameDataArray);

      const response = await fetch('/api/collage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ frameDataArrayString }),
      });

      if (response.ok) {
        const { collageData } = await response.json();
        // Do something with the collageData received from the backend.
      } else {
        console.error('Failed to send data to the backend.');
      }


      // const frameData = await ffmpeg.readFile("frame-001.png");
      // const frameBlob = new Blob([frameData], { type: 'image/png' }); 
      // const frameFormData = new FormData();
      // frameFormData.append('frame', frameBlob, 'frame1.png');
      // console.log(frameFormData);
      // console.log("frame Data" , frameData);
      // const dataUrl = URL.createObjectURL(frameBlob);
      // console.log("dataUrl", dataUrl);


      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: frameFormData,

      // });
  
      // if (response.ok) {
      //   console.log('Frames uploaded successfully');
      // } else {
      //   console.error('Error uploading frames');
      // }
    } catch (error) {
      console.error('Error capturing frames:', error);
    }
  };

  const fetchFile = async (path: string) => {
    const response = await fetch(path);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  };

//   const handleCapture = async () => {
    
//     const videoPath = video[0].path; // Assuming only one video file is uploaded
//     const outputFolder = 'frames';
    
//     // if (!fs.existsSync(outputFolder)) {
//         //   fs.mkdirSync(outputFolder);
//         // }
        
//     console.log("yo");
//     const framePaths = await captureFrames(videoPath, outputFolder);
//     console.log('Frames captured:', framePaths);
//   };

  return (
    (video && video.length ?(
        <video
            ref={videoRef}
            className="rounded-3xl pt-[100px] shadow-sm border-2 border-dashed cursor-pointer"
            controls
            width="250"
            src={URL.createObjectURL(video[0])}>
    </video>
    ):(
    <>
        <ReactDropzone
        onDrop={handleUpload}
        onDragEnter={() => setIsHover(true)}
        onDragLeave={() => setIsHover(false)}
        >
        {({ getRootProps, getInputProps }) => (
            <div
            {...getRootProps()}
            className="bg-white-300 h-72 lg:h-80 xl:h-96 rounded-3xl shadow-sm border-2 border-dashed cursor-pointer flex items-center justify-center"
            >
            <input {...getInputProps()}/>
            <div className="space-y-4 text-muted-foreground">
                {is_hover ? (
                <>
                    <div className="justify-center flex text-6xl">
                    {/* Icon for hover state */}
                    </div>
                    <h3 className="text-center font-medium text-2xl">
                    Yes, right there
                    </h3>
                </>
                ) : (
                <>
                    <div className="justify-center flex text-6xl">
                    {/* Icon for non-hover state */}
                    </div>
                    <h3 className="text-center font-medium text-2xl">
                    Drop your video
                    </h3>
                </>
                )}
            </div>
            </div>
        )}
        </ReactDropzone>
        {/* <button
        onClick={handleCapture}
        disabled={!is_ready || is_hover}
        className="rounded-xl font-semibold py-4 text-md"
        >
        Capture Frames
        </button> */}
    </>
  ))
  );
}
