import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';


async function main() {
  const ai = new GoogleGenAI({
    apiKey: 'AIzaSyCvd9I6F53Crn5SKVAinmzZsPZmq1I70g8',  
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'print hello world 10 times with counting',
  });

  console.log(response.text);
}

main().catch(console.error);
