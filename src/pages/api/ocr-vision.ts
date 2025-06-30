import { NextApiRequest, NextApiResponse } from 'next';
import { readFile } from 'fs/promises';
import path from 'path';
import formidable from 'formidable';
import vision from '@google-cloud/vision';

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Init Vision client
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(process.cwd(), 'google-credentials.json'), // <== Replace with your JSON key file path
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const buffer = await readFile(file.filepath);

    try {
      const [result] = await client.documentTextDetection({ image: { content: buffer } });
      const fullText = result.fullTextAnnotation?.text || '';
      res.status(200).json({ text: fullText });
    } catch (error: any) {
      console.error('OCR Error:', error);
      res.status(500).json({ error: error.message || 'OCR failed' });
    }
  });
}
