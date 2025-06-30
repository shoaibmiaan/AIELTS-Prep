import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const cueCard = {
  topic: 'Describe a person who has inspired you.',
  points: [
    'Who this person is',
    'How you met them',
    'What qualities you admire',
    'How they have influenced you',
  ],
};

export default function SpeakingPart2() {
  const [prepStarted, setPrepStarted] = useState(false);
  const [prepSeconds, setPrepSeconds] = useState(0);
  const [notes, setNotes] = useState('');
  const [recording, setRecording] = useState(false);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (prepStarted && prepSeconds < 60) {
      const timer = setInterval(() => {
        setPrepSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (prepSeconds >= 60) {
      setPrepStarted(false);
      startRecording();
    }
  }, [prepStarted, prepSeconds]);

  useEffect(() => {
    if (recording && speakingSeconds < 120) {
      const timer = setInterval(() => {
        setSpeakingSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [recording, speakingSeconds]);

  const startPreparation = () => {
    setPrepStarted(true);
    setPrepSeconds(0);
    setSpeakingSeconds(0);
    setMediaBlobUrl(null);
    setNotes('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (event) => audioChunks.current.push(event.data);

      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setMediaBlobUrl(url);
        uploadToSupabase(blob);
      };

      recorder.start();
      setRecording(true);

      setTimeout(() => {
        stopRecording();
      }, 2 * 60 * 1000);
    } catch (error) {
      console.error('Error accessing microphone', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const uploadToSupabase = async (blob: Blob) => {
    const fileName = `speaking-${Date.now()}.webm`;
    const { error: storageError } = await supabase.storage
      .from('speaking-audio')
      .upload(fileName, blob, {
        contentType: 'audio/webm',
      });

    if (storageError) {
      console.error('Storage error:', storageError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('speaking-audio').getPublicUrl(fileName);
    const audioUrl = publicUrlData.publicUrl;

    const { error: dbError } = await supabase.from('speaking_responses').insert({
      notes,
      audio_url: audioUrl,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error('DB insert error:', dbError.message);
    } else {
      console.log('Upload and insert successful');
    }
  };

  useEffect(() => {
    if (mediaBlobUrl && waveformRef.current) {
      if (wavesurfer.current) wavesurfer.current.destroy();

      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#94a3b8',
        progressColor: '#0284c7',
        height: 80,
      });

      wavesurfer.current.load(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">IELTS Speaking - Part 2</h1>

      <div className="bg-gray-100 border p-4 rounded mb-4">
        <p className="font-semibold mb-2">{cueCard.topic}</p>
        <ul className="list-disc list-inside text-gray-800 text-sm">
          {cueCard.points.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

      {!prepStarted && !recording && !mediaBlobUrl && (
        <button
          onClick={startPreparation}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
        >
          Start 1-Minute Preparation
        </button>
      )}

      {prepStarted && (
        <div className="mt-4">
          <p className="text-blue-600 font-mono text-sm mb-2">
            Preparing... {prepSeconds}s / 60s
          </p>
          <textarea
            rows={4}
            placeholder="Make quick notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
      )}

      {recording && (
        <div className="mt-4">
          <p className="text-green-600 font-mono text-sm mb-2">
            Speaking... {speakingSeconds}s / 120s
          </p>
          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Stop Recording Early
          </button>
        </div>
      )}

      {mediaBlobUrl && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Your Recorded Answer</h3>
          <div ref={waveformRef} className="w-full h-24 bg-gray-200 rounded" />
          <audio controls src={mediaBlobUrl} className="mt-2 w-full" />
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => router.push('/practice/speaking/part1')}
          className="text-blue-600 underline"
        >
          ← Part 1
        </button>
        <button
          onClick={() => router.push('/practice/speaking/part3')}
          className="text-blue-600 underline"
        >
          Part 3 →
        </button>
      </div>
    </div>
  );
}
