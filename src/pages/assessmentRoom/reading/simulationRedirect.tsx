'use client'
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function ReadingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      // Fetch ALL ids (or limit 50 for big DB)
      const { data, error } = await supabase
        .from("reading_papers")
        .select("id");

      if (error) {
        alert("Supabase error: " + error.message);
        return;
      }
      if (!data || data.length === 0) {
        alert("No reading tests available.");
        return;
      }
      // Pick a random id
      const random = data[Math.floor(Math.random() * data.length)].id;
      router.push(`/assessmentRoom/reading/${random}`);
    };
    fetchAndRedirect();
  }, []);

  return <div>Loading...</div>;
}
