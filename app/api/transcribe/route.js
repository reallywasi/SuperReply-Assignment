import fs from 'fs';
import formidable from 'formidable';
import axios from 'axios';

export async function POST(req) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return new Response(JSON.stringify({ error: 'File parsing error' }), {
        status: 400,
      });
    }

    const audioFile = files.audioFile[0];
    if (!audioFile) {
      console.error("No audio file uploaded");
      return new Response(JSON.stringify({ error: 'No audio file uploaded' }), {
        status: 400,
      });
    }

    try {
      const apiKey = 'a6d367634c5745ef9f75bd8731f6cdb2';
      const audioData = fs.readFileSync(audioFile.filepath);
      
      // Upload the audio to AssemblyAI
      const uploadResponse = await axios.post(
        'https://api.assemblyai.com/v2/upload',
        audioData,
        {
          headers: {
            Authorization: apiKey,
            'Content-Type': 'audio/mpeg', 
          },
        }
      );

      console.log("Upload response:", uploadResponse.data);

      // Request transcription from AssemblyAI
      const transcriptionResponse = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        { audio_url: uploadResponse.data.upload_url },
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      console.log("Transcription response:", transcriptionResponse.data);

      return new Response(
        JSON.stringify({ transcriptId: transcriptionResponse.data.id }),
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error("Error with AssemblyAI API:", error.response ? error.response.data : error);
      return new Response(
        JSON.stringify({ error: 'Failed to transcribe audio' }),
        {
          status: 500,
        }
      );
    }
  });
}
