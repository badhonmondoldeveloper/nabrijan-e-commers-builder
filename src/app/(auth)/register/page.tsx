'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Lock, Mail, User, Phone } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Automatically redirect to Store Onboarding Wizard
      router.push('/dashboard/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FAF4] text-[#17221D] flex items-center justify-center p-4 selection:bg-[#55B510] selection:text-white">
      <div className="w-full max-w-md my-8">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-[#063B2A] hover:text-[#55B510] mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
        </Link>

        <Card className="bg-white border border-[#DCE7DF] text-[#17221D] shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-4">
            <Link href="/" className="inline-block mx-auto mb-2">
              <img src="/images/logo.png" alt="Nabrijan - Build Your Online Store" className="h-12 w-auto object-contain mx-auto" />
            </Link>
            <CardTitle className="text-2xl font-black text-[#063B2A]">Register Free Account</CardTitle>
            <CardDescription className="text-[#66736C]">
              Start your E-Commerce journey in less than 2 minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#063B2A]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-[#66736C]" />
                  <Input
                    type="text"
                    placeholder="Tanvir Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10 bg-[#F6FAF4] border-[#DCE7DF] text-[#17221D] focus:border-[#55B510] focus:ring-[#55B510] rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#063B2A]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#66736C]" />
                  <Input
                    type="email"
                    placeholder="tanvir@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-[#F6FAF4] border-[#DCE7DF] text-[#17221D] focus:border-[#55B510] focus:ring-[#55B510] rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#063B2A]">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-[#66736C]" />
                  <Input
                    type="tel"
                    placeholder="01700000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 bg-[#F6FAF4] border-[#DCE7DF] text-[#17221D] focus:border-[#55B510] focus:ring-[#55B510] rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#063B2A]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#66736C]" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-[#F6FAF4] border-[#DCE7DF] text-[#17221D] focus:border-[#55B510] focus:ring-[#55B510] rounded-xl h-11"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#55B510] hover:bg-[#489d0d] text-white font-extrabold h-11 rounded-xl shadow-lg shadow-[#55B510]/30 transition transform hover:scale-[1.01]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Create Account & Continue'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-[#DCE7DF] bg-[#F6FAF4] py-4 text-xs text-[#66736C]">
            Already registered?{' '}
            <Link href="/login" className="text-[#55B510] hover:underline font-extrabold ml-1">
              Log In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
