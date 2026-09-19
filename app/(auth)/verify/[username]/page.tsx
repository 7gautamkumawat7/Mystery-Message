'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/app/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/app/types/ApiResponse';
import { Loader2, KeyRound, MessageSquare } from 'lucide-react';
import Link from 'next/link';

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyAccountPage() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawUsername = params?.username ?? '';
  const decodedUsername = decodeURIComponent(rawUsername);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: VerifyFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>('/api/verify-code', {
        username: decodedUsername,
        code: data.code,
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
        });

        router.replace('/sign-in');
      } else {
        toast({
          title: 'Verification Failed',
          description: response.data.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data?.message ??
        'An error occurred during verification. Please try again.';

      toast({
        title: 'Verification Failed',
        description: errorMessage,
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
            Verify Your Account
          </h1>
          <p className="text-sm text-slate-400">
            Enter the 6-digit verification code sent to your email for{' '}
            <span className="font-semibold text-blue-400">@{decodedUsername}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Verification Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                {...register('code')}
                type="text"
                maxLength={6}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border ${
                  errors.code
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-800 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg text-white tracking-widest text-center text-lg placeholder-slate-600 focus:outline-none focus:ring-2 transition`}
                placeholder="123456"
              />
            </div>
            {errors.code && (
              <p className="mt-1 text-xs text-red-400 font-medium">
                {errors.code.message}
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
                <span>Verifying...</span>
              </>
            ) : (
              'Verify Code'
            )}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800">
          Back to{' '}
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
