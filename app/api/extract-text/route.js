import { NextResponse } from 'next/server';
import FormData from 'form-data';
import axios from 'axios';

export async function POST(req) {
  try {
    // Get the incoming audio file
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const form = new FormData();
    form.append('audio', audioFile, audioFile.name);

    // Replace with your actual API URL and key (e.g., OpenAI Whisper or Google Speech-to-Text)
    const response = await axios.post('YOUR_API_URL', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer YOUR_API_KEY`, // Replace with actual API key
      },
    });

    // Assuming the API returns a 'transcription' field with the extracted text
    const extractedText = response.data.transcription || 'No text extracted';

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json({ error: 'Failed to extract text from audio.' }, { status: 500 });
  }
}
