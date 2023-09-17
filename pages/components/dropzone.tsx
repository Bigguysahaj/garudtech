import React, { useState, useEffect, useRef } from 'react';
import ReactDropzone from 'react-dropzone';
// import fs from 'fs';
import path from 'path';
// import loadFfmpeg from '../utils/load-ffmpeg';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

interface DropzoneProps {
    frameInterval: number;
    }

export default function Dropzone({ frameInterval }: DropzoneProps) {
  const [is_hover, setIsHover] = useState(false);
  const [video, setVideo] = useState([]);
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const ffmpegRef = useRef(new FFmpeg())
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const messageRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
      const load = async () => {
          setIsLoading(true)
          const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
          const ffmpeg = ffmpegRef.current
        ffmpeg.on('log', ({ message }) => {
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
    console.log("outputFolder:",outputFolder);
    captureFrames(videoPath);
    // console.log('Frames captured:', framePaths);
  };

  const captureFrames = async (videoPath: string) => {
    if (!ffmpegRef.current) return [];
    
    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoPath));
      
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-vf', `fps=1/${frameInterval}`,
        "frame1.png",
      ]);
      
      const frameData = await ffmpeg.readFile('frame1.png');
      console.log("yo");
      const frameBlob = new Blob([frameData], { type: 'image/png' }); 
      const frameFormData = new FormData();
      frameFormData.append('frame', frameBlob, 'frame1.png');
  
      // Send the frame data to the API route
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
