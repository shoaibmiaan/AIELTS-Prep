'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter a valid email.');
      return;
    }

    setSubmitting(true);

    // Check for existing email
    const { data: existing, error: checkError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      toast.error('Already subscribed with this email.');
      setSubmitting(false);
      return;
    }

    if (checkError && checkError.code !== 'PGRST116') {
      toast.error('Something went wrong. Please try again.');
      console.error(checkError);
      setSubmitting(false);
      return;
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert([{ email }]);

    if (insertError) {
      toast.error('Failed to subscribe.');
      console.error(insertError);
    } else {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success('🎉 Subscribed successfully!');

      setEmail('');

      // Redirect to thank-you page
      setTimeout(() => router.push('/thank-you'), 2000);
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded-md text-sm"
        required
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium text-sm py-2 px-4 rounded-md transition disabled:opacity-50"
      >
        {submitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}
