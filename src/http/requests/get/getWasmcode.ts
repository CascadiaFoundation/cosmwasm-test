import fs from 'fs';
import path from 'path';

export default function handler(req:any, res:any) {
  const filePath = path.join(process.cwd(), 'yourfile.txt');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  res.status(200).json({ fileContents });
}