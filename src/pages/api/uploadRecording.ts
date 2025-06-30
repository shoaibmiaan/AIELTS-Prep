import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable default body parser (Next.js)
export const config = {
  api: {
    bodyParser: false,
  },
};

type Data = {
  message: string;
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  // Make sure uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
    filename: (_name, _ext, part) => {
      // part.originalFilename contains original file name
      // We can customize saved file name if needed
      return part.originalFilename || `audio_${Date.now()}.webm`;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      res.status(500).json({ message: 'Error parsing the files' });
      return;
    }

    // You can access uploaded file info via files.file (matches formData key)
    const uploadedFile = files.file as File;

    if (!uploadedFile) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // Optionally, rename/move the file here if needed

    res.status(200).json({ message: 'File uploaded successfully' });
  });
};

export default handler;
