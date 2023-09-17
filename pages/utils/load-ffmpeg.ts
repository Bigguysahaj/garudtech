// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import { toBlobURL } from '@ffmpeg/util';

// export default async function loadFfmpeg(): Promise<FFmpeg> {
//     const baseURL = 'https://unpkg.com/browse/@ffmpeg/core@0.12.2/dist/umd'
//     const ffmpeg = new FFmpeg()
// //   ffmpeg.on('log', ({ message }) => {
// //     if (messageRef.current) messageRef.current.innerHTML = message
// //   })

//   await ffmpeg.load({
//     coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
//     wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
//   });
//   return ffmpeg;
// }