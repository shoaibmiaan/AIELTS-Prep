import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

export default function PhoneLoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        setError(error.message);
      } else {
        setIsOtpSent(true);
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      const { user, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
      });

      if (error) {
        setError(error.message);
      } else {
        toast.success('Successfully logged in!');
        router.push('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-6">Log In with Phone</h1>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:underline"
          >
            Back
          </button>
        </div>

        <form className="space-y-4">
          {!isOtpSent ? (
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 rounded border focus:outline-none mb-4"
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded transition disabled:opacity-50"
              >
                {loading ? 'Sending OTP…' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 rounded border focus:outline-none mb-4"
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-green-500 text-white font-semibold py-2 rounded transition disabled:opacity-50"
              >
                {loading ? 'Verifying OTP…' : 'Verify OTP'}
              </button>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
