// // import { NextApiRequest, NextApiResponse } from 'next';
// // import multer from 'multer';
// // import { spawn } from 'child_process';
// // import fs from 'fs';

// // interface CustomNextApiRequest extends NextApiRequest {
// //     file: {
// //         path: string;
// //     };
// // }

// // const upload = multer({ dest: 'uploads/' });

// // export default upload.single('video')(async (req: CustomNextApiRequest, res: NextApiResponse) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ error: 'No file uploaded' });
// //     }

// //     const videoPath = req.file.path;
// //     const outputFolder = 'frames/';

// //     // Create the frames folder if it doesn't exist
// //     if (!fs.existsSync(outputFolder)) {
// //       fs.mkdirSync(outputFolder);
// //     }

// //     const ffmpeg = spawn('ffmpeg', [
// //       '-i', videoPath,
// //       '-vf', `fps=1/3`,
// //       `${outputFolder}frame-%03d.png`,
// //     ]);

// //     ffmpeg.on('close', (code) => {
// //       if (code === 0) {
// //         res.status(200).json({ message: 'Frames extracted successfully' });
// //       } else {
// //         res.status(500).json({ error: 'Frame extraction failed' });
// //       }
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });


// // pages/api/uploadFrames.js

// import formidable from 'formidable';
// import fs from 'fs';
// import path from 'path';
// import { NextApiRequest, NextApiResponse } from 'next';

// export const config = {
//   api: {
//     bodyParser: false, // Disable default body parsing to handle file uploads manually
//   },
// };

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const form = new formidable.IncomingForm();
//   form.uploadDir = path.join(process.cwd(), 'public', 'frames'); // Define where to save the frames on the server

//   form.on('file', (name, file) => {
//     // Handle each uploaded file (frame)
//     const oldPath = file.path;
//     const newPath = path.join(form.uploadDir, file.name);

//     // Rename and move the file to the frames directory
//     fs.rename(oldPath, newPath, (err) => {
//       if (err) {
//         console.error('Error moving file:', err);
//         res.status(500).json({ error: 'Error moving file' });
//       }
//     });
//   });

//   form.on('end', () => {
//     res.status(200).json({ message: 'Frames uploaded successfully' });
//   });

//   form.parse(req);
// };
