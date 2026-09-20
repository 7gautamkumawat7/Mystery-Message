'use client';

import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/app/schemas/signInSchema';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { status } = useSession();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        let msg = 'An unexpected error occurred';
        if (result.error === 'CredentialsSignin') {
          msg = 'Incorrect email/username or password';
        } else {
          msg = result.error;
        }

        setErrorMessage(msg);
        toast({
          title: 'Sign-in Failed',
          description: msg,
          variant: 'destructive',
        });
        return;
      }

      if (result?.ok) {
        toast({
          title: 'Success',
          description: 'Signed in successfully! Redirecting...',
        });
        // Force full page navigation to hydrate NextAuth session and cookies
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setErrorMessage(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 mb-2">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400">
            Sign in to access your anonymous feedback dashboard
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-3 text-sm text-red-300 bg-red-950/50 border border-red-800/80 rounded-lg flex items-center gap-2">
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email or Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                {...register('identifier')}
                type="text"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border ${
                  errors.identifier ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition`}
                placeholder="Enter your email or username"
              />
            </div>
            {errors.identifier && (
              <p className="mt-1 text-xs text-red-400 font-medium">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="text-blue-400 hover:text-blue-300 font-medium transition underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
