// 'use client';
// import React, { useState } from 'react';
// import axios from 'axios';

// const Page = () => {
//   const [audioFile, setAudioFile] = useState(null);
//   const [transcript, setTranscript] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setAudioFile(file);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!audioFile) {
//       setError('Please upload an audio file.');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setTranscript('');

//     try {
//       // Upload the audio file to AssemblyAI
//       const formData = new FormData();
//       formData.append('file', audioFile);

//       const uploadRes = await axios.post('https://api.assemblyai.com/v2/upload', formData, {
//         headers: {
//           Authorization: 'a6d367634c5745ef9f75bd8731f6cdb2',  // Your AssemblyAI API key
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (uploadRes.data.upload_url) {
//         // Once uploaded, send the file URL to transcribe
//         const transcriptRes = await axios.post(
//           'https://api.assemblyai.com/v2/transcript',
//           {
//             audio_url: uploadRes.data.upload_url,
//           },
//           {
//             headers: {
//               Authorization: 'a6d367634c5745ef9f75bd8731f6cdb2',  // Your AssemblyAI API key
//             },
//           }
//         );

//         const { id } = transcriptRes.data;
        
//         // Check for the transcript status
//         const checkTranscript = async () => {
//           const result = await axios.get(`https://api.assemblyai.com/v2/transcript/${id}`, {
//             headers: {
//               Authorization: 'a6d367634c5745ef9f75bd8731f6cdb2', // Your API Key
//             },
//           });

//           if (result.data.status === 'completed') {
//             setTranscript(result.data.text);
//             setLoading(false);
//           } else if (result.data.status === 'failed') {
//             setError('Failed to transcribe the audio');
//             setLoading(false);
//           } else {
//             // If not completed, retry after some time
//             setTimeout(checkTranscript, 3000); // Retry every 3 seconds
//           }
//         };

//         checkTranscript(); // Initiate the polling
//       } else {
//         setError('Failed to upload the audio file');
//         setLoading(false);
//       }
//     } catch (err) {
//       console.error(err);
//       setError('An error occurred');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl mb-4">Upload an Audio File for Transcription</h1>
//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         <input
//           type="file"
//           accept="audio/*"
//           onChange={handleFileChange}
//           className="mb-4"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           disabled={loading}
//         >
//           {loading ? 'Transcribing...' : 'Submit'}
//         </button>
//       </form>

//       {error && <div className="mt-4 text-red-500">{error}</div>}

//       {transcript && (
//         <div className="mt-4 p-4 border rounded bg-gray-100">
//           <h2 className="text-xl">Transcript:</h2>
//           <p>{transcript}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Page;

















































































'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [addedText, setAddedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileSizeError, setFileSizeError] = useState(false);
  const [finalAudioUrl, setFinalAudioUrl] = useState(null);

  // Toast Notifications
  const notifySuccess = (message) => {
    toast.success(message, {
      autoClose: 5000,
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      autoClose: 5000,
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setFileSizeError(false);

    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileSizeError(true);
      notifyError('File is too large. Max size is 5MB');
      return;
    }

    setAudioFile(file);
    setTranscript('');
    setFinalAudioUrl(null);
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await axios.post('https://api.assemblyai.com/v2/upload', formData, {
        headers: {
          Authorization: 'a6d367634c5745ef9f75bd8731f6cdb2', // AssemblyAI API Key
          'Content-Type': 'multipart/form-data',
        },
      });

      if (uploadRes.data.upload_url) {
        const transcriptRes = await axios.post(
          'https://api.assemblyai.com/v2/transcript',
          { audio_url: uploadRes.data.upload_url },
          {
            headers: {
              Authorization: 'a6d367634c5745ef9f75bd8731f6cdb2', // API Key
            },
          }
        );

        const { id } = transcriptRes.data;

        // Check transcript status
        const checkTranscript = async () => {
          const result = await axios.get(`https://api.assemblyai.com/v2/transcript/${id}`, {
            headers: {
              Authorization: 'a6d367634c5745ef9f75bd8731f6cdb2', // API Key
            },
          });

          if (result.data.status === 'completed') {
            setTranscript(result.data.text);
            setLoading(false);
            notifySuccess('Transcription completed!');
          } else if (result.data.status === 'failed') {
            setError('Transcription failed');
            setLoading(false);
          } else {
            setTimeout(checkTranscript, 3000);
          }
        };

        checkTranscript();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      notifyError('An error occurred during the transcription process.');
    }
  };

  const handleSpeakText = () => {
    const fullText = transcript + ' ' + addedText;

    // Word count validation (max 500 words)
    if (fullText.split(' ').length > 500) {
      notifyError('Text exceeds 500 words.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(fullText);
    speechSynthesis.speak(utterance);

    // Generate final audio URL for download
    const audioBlob = new Blob([fullText], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    setFinalAudioUrl(audioUrl);
  };

  return (

    <div>

<div className="hero bg-gradient-to-b from-gray-200 to-gray-300 min-h-[95vh] flex flex-col items-center justify-center text-center p-12">  <div className="hero-content max-w-7xl w-full p-12 bg-white bg-opacity-90 rounded-3xl shadow-xl">
    <div className="text-gray-800">
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-400">
        Welcome to Audio Pro!
      </h1>
      <p className="py-6 text-lg text-gray-600 leading-relaxed mb-12 font-bold">
        Follow these simple steps to start transforming your audio recordings effortlessly:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-teal-200 p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            <span className="text-teal-600">Step 1:</span> Upload a Voice File
          </h3>
          <p className="text-gray-600 text-base font-bold">
            Upload your voice recording (max 5MB). <span className="text-teal-600">MP3, WAV</span> formats supported.
          </p>
        </div>

        <div className="bg-indigo-200 p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            <span className="text-indigo-600">Step 2:</span> Write Some Text
          </h3>
          <p className="text-gray-600 text-base font-bold">
            Type the <span className="text-indigo-600">text</span> you want the voice to say. Max 500 characters.
          </p>
        </div>

        <div className="bg-pink-200 p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            <span className="text-pink-600">Step 3:</span> Create a New Voice File
          </h3>
          <p className="text-gray-600 text-base font-bold">
            We generate a new voice file with your text in the uploaded voice. <span className="text-pink-600">Magic!</span>
          </p>
        </div>

        <div className="bg-yellow-200 p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            <span className="text-yellow-600">Step 4:</span> Download the New Voice File
          </h3>
          <p className="text-gray-600 text-base font-bold">
            Click to download your newly created <span className="text-yellow-600">voice file</span> and enjoy!
          </p>
        </div>
      </div>

      <div className="mt-12">
        <a
          href="#bottom-section"  // Add a link to scroll to the bottom section
          className="bg-gradient-to-r from-teal-400 to-indigo-400 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-gradient-to-r hover:from-teal-500 hover:to-indigo-500 transition-all duration-300"
        >
          Get Started
        </a>
      </div>
    </div>
  </div>
</div>







    <div id="bottom-section"  className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-6">
      <ToastContainer />

      <div className="max-w-xl bg-gray-800 p-6 rounded-lg shadow-lg w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">Audio Transcription & Text-to-Speech</h1>

        <section className="mb-8">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full p-4 text-lg bg-gray-700 border-2 border-blue-500 rounded-lg cursor-pointer"
          />
          {fileSizeError && (
            <p className="text-red-500 text-center mt-2">File is too large. Max size is 5MB.</p>
          )}
        </section>

        {loading && <p className="text-center text-yellow-400">Transcribing...</p>}

        {transcript && (
          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Transcription:</h3>
            <p>{transcript}</p>
          </div>
        )}

        <section className="mt-8">
          <textarea
            value={addedText}
            onChange={(e) => setAddedText(e.target.value)}
            className="w-full h-24 p-4 text-lg bg-gray-700 border-2 border-blue-500 rounded-lg focus:outline-none"
            placeholder="Add your own text here..."
          />
        </section>

        <div className="mt-8">
          <button
            onClick={handleSpeakText}
            className="w-full bg-blue-600 text-white p-4 rounded-lg text-lg hover:bg-blue-700 focus:outline-none"
            disabled={loading || !transcript}
          >
            Speak Transcribed + Added Text
          </button>
        </div>

        {finalAudioUrl && (
          <div className="mt-8 text-center">
            <a
              href={finalAudioUrl}
              download="final-audio.wav"
              className="text-white bg-green-600 p-4 rounded-lg hover:bg-green-700 focus:outline-none"
            >
              Download Final Audio
            </a>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Page;



