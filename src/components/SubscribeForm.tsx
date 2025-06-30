'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function SubscribeForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in both fields.');
      return;
    }

    setSubmitting(true);

    // Check for existing subscription
    const { data: existingSubscriber, error: selectError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      toast.error('This email is already registered. Please use a different email.');
      setSubmitting(false);
      return;
    }

    if (selectError && selectError.code !== 'PGRST116') {
      toast.error('An error occurred. Please try again.');
      console.error(selectError);
      setSubmitting(false);
      return;
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('subscriptions')
      .insert([{ name, email }]);

    if (error) {
      toast.error('Subscription failed.');
      console.error(error);
    } else {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success('🎉 Subscribed successfully!');

      setName('');
      setEmail('');

      setTimeout(() => {
        router.push('/thank-you');
      }, 1800);
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        className="w-full bg-yellow-600 text-white p-2 rounded disabled:opacity-50"
        disabled={submitting}
      >
        {submitting ? 'Subscribing…' : 'Subscribe'}
      </button>
    </form>
  );
}
