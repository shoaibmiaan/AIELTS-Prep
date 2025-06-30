import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { speakingPrompts } from "@/lib/speakingPrompts";

const RECORDING_TIME_MS = 30_000; // 30 seconds

export default function SpeakingPart1() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<(Blob | null)[]>(Array(speakingPrompts.length).fill(null));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationIdRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const userId = "demo-user-id"; // Replace with actual logged-in user id

  // Start recording and waveform visualization
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      drawWaveform();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordings((prev) => {
          const updated = [...prev];
          updated[currentQuestionIndex] = blob;
          return updated;
        });
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after fixed time
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        stopRecording();
      }, RECORDING_TIME_MS);
    } catch (error) {
      alert("Error accessing microphone: " + error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !analyser || !ctx) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.strokeStyle = "#007bff";
      ctx.lineWidth = 2;
      ctx.stroke();

      animationIdRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  // When question changes, start new recording automatically
  useEffect(() => {
    startRecording();

    // Cleanup on unmount or question change
    return () => {
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  // Upload a single blob to Supabase Storage & return public URL
  const uploadRecording = async (blob: Blob, promptId: number): Promise<string | null> => {
    try {
      const filename = `speaking-recordings/${userId}_${promptId}_${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from("speaking-audio")
        .upload(filename, blob, { upsert: true });
      if (uploadError) {
        console.error("Upload error:", uploadError);
        return null;
      }
      const { publicUrl, error: urlError } = supabase.storage
        .from("speaking-audio")
        .getPublicUrl(filename);
      if (urlError) {
        console.error("Public URL error:", urlError);
        return null;
      }
      return publicUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  // Handle next question click: stop current recording & go next
  const nextQuestion = async () => {
    stopRecording();

    // Upload current recording before advancing
    const currentBlob = recordings[currentQuestionIndex];
    if (currentBlob) {
      const promptId = speakingPrompts[currentQuestionIndex]?.id || 0;
      const url = await uploadRecording(currentBlob, promptId);
      if (!url) {
        alert("Failed to upload recording for question " + (currentQuestionIndex + 1));
        return; // stop progression if upload fails
      }
      // Save uploaded URL in local state or DB if needed
      // For simplicity, just log
      console.log("Uploaded recording URL:", url);
    }

    if (currentQuestionIndex < speakingPrompts.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // On submit: upload all recordings then send URLs + prompt info to API
  const handleSubmit = async () => {
    stopRecording();

    try {
      // Upload all recordings if not uploaded yet (for simplicity we upload again here)
      const uploadedUrls: string[] = [];

      for (let i = 0; i < recordings.length; i++) {
        const blob = recordings[i];
        if (!blob) {
          alert(`No recording for question ${i + 1}`);
          return;
        }
        const promptId = speakingPrompts[i]?.id || 0;
        const url = await uploadRecording(blob, promptId);
        if (!url) {
          alert("Failed to upload recording for question " + (i + 1));
          return;
        }
        uploadedUrls.push(url);
      }

      // Send to evaluation API
      const response = await fetch("/api/evaluate-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          recordings: uploadedUrls,
          prompts: speakingPrompts.map((p) => ({ id: p.id, question: p.question })),
        }),
      });

      const data = await response.json();

      if (data.feedback) {
        alert(`Evaluation complete! Feedback:\n${data.feedback}`);
        setCurrentQuestionIndex(0);
        setRecordings(Array(speakingPrompts.length).fill(null));
      } else {
        alert("Evaluation failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      alert("Evaluation error: " + error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Speaking Practice – Part 1</h1>
      <p className="text-lg mb-2">
        Question {currentQuestionIndex + 1}: {speakingPrompts[currentQuestionIndex]?.question}
      </p>

      <canvas ref={canvasRef} width={500} height={100} className="border mb-4" />

      <div className="mb-4">
        <p>{isRecording ? "Recording..." : "Not recording"}</p>
      </div>

      <div className="flex gap-4">
        {currentQuestionIndex < speakingPrompts.length - 1 && (
          <button
            onClick={nextQuestion}
            disabled={isRecording}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={isRecording}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
