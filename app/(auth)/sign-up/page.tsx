'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signUpSchema } from '@/app/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/app/types/ApiResponse';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
  XCircle,
} from 'lucide-react';

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const lastCheckedUsernameRef = useRef('');

  useEffect(() => {
    const trimmedVal = username.trim();

    // If empty or too short, reset status immediately without querying API
    if (!trimmedVal || trimmedVal.length < 2) {
      setUsernameMessage('');
      setIsCheckingUsername(false);
      lastCheckedUsernameRef.current = '';
      return;
    }

    // Avoid querying again if already verified for this exact value
    if (trimmedVal === lastCheckedUsernameRef.current) {
      return;
    }

    setIsCheckingUsername(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${encodeURIComponent(trimmedVal)}`,
          { signal: controller.signal }
        );
        lastCheckedUsernameRef.current = trimmedVal;
        setUsernameMessage(response.data.message);
      } catch (error) {
        if (!axios.isCancel(error)) {
          const axiosError = error as AxiosError<ApiResponse>;
          lastCheckedUsernameRef.current = trimmedVal;
          setUsernameMessage(
            axiosError.response?.data?.message ?? 'Error checking username'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingUsername(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [username]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
        });

        router.replace(`/verify/${encodeURIComponent(data.username)}`);
      } else {
        toast({
          title: 'Sign Up Failed',
          description: response.data.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data?.message ??
        'There was a problem registering your account. Please try again.';

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUsernameUnique = usernameMessage === 'Username is unique';

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 mb-2">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Join Mystery Message
          </h1>
          <p className="text-sm text-slate-400">
            Sign up to start your anonymous feedback adventure
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                {...register('username', {
                  onChange: (e) => {
                    const val = e.target.value;
                    setValue('username', val);
                    setUsername(val);
                  },
                })}
                type="text"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border ${
                  errors.username
                    ? 'border-red-500 focus:ring-red-500'
                    : username && !isCheckingUsername && isUsernameUnique
                    ? 'border-emerald-500 focus:ring-emerald-500'
                    : username && !isCheckingUsername && usernameMessage
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-800 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition`}
                placeholder="Choose a unique username"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {isCheckingUsername ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                ) : username && usernameMessage ? (
                  isUsernameUnique ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )
                ) : null}
              </div>
            </div>

            {/* Stable height feedback container prevents UI flickering/layout jumping */}
            <div className="min-h-[20px] mt-1 flex items-center">
              {isCheckingUsername ? (
                <p className="text-xs text-blue-400/90 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Checking username availability...
                </p>
              ) : username && usernameMessage ? (
                <p
                  className={`text-xs font-medium ${
                    isUsernameUnique ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {usernameMessage}
                </p>
              ) : errors.username ? (
                <p className="text-xs text-red-400 font-medium">
                  {errors.username.message}
                </p>
              ) : null}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                {...register('email')}
                type="email"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-800 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
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
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-800 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition`}
                placeholder="Create a password (min. 8 characters)"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isCheckingUsername}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800">
          Already a member?{' '}
          <Link
            href="/sign-in"
            className="text-blue-400 hover:text-blue-300 font-medium transition underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
