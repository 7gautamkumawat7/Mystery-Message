'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { messageSchema } from '@/app/schemas/messageSchema';
import { ApiResponse } from '@/app/types/ApiResponse';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  Send,
  Loader2,
  Sparkles,
  MessageSquare,
  User,
  CheckCircle2,
} from 'lucide-react';

type MessageFormValues = z.infer<typeof messageSchema>;

const initialQuestions = [
  "What's your favorite movie of all time?",
  "Do you have any pet that you love the most?",
  "What's a dream destination you'd love to visit?",
];

export default function SendMessagePage() {
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const rawUsername = params?.username ?? '';
  const decodedUsername = decodeURIComponent(rawUsername);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(initialQuestions);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (data: MessageFormValues) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username: decodedUsername,
        content: data.content,
      });

      toast({
        title: 'Message Sent!',
        description: response.data.message,
      });

      reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data?.message || 'Failed to send message';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/suggest-messages');
      if (response.data.message) {
        const questions = response.data.message
          .split('||')
          .map((q) => q.trim())
          .filter((q) => q.length > 0);

        if (questions.length > 0) {
          setSuggestedQuestions(questions);
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data?.message ||
          'Failed to fetch suggested messages',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const handleSelectQuestion = (question: string) => {
    setValue('content', question, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 flex flex-col items-center justify-center text-slate-100">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 mb-1">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Send Anonymous Message
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Write a message to{' '}
            <span className="font-semibold text-blue-400">@{decodedUsername}</span>. Your identity is 100% secret.
          </p>
        </div>

        {/* Message Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-xl"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Message
            </label>
            <textarea
              {...register('content')}
              rows={4}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-slate-950/80 border ${
                errors.content ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500 focus:border-blue-500'
              } rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition resize-none`}
              placeholder="Write your anonymous message here..."
            />
            {errors.content && (
              <p className="mt-1.5 text-xs text-red-400 font-medium">
                {errors.content.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition duration-150 ease-in-out flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>

        {/* Suggested Messages Box */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Suggested Messages</span>
            </h2>
            <button
              type="button"
              onClick={handleFetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition cursor-pointer disabled:opacity-50"
            >
              {isSuggestLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <span>Suggest with AI</span>
              )}
            </button>
          </div>
          <div className="space-y-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectQuestion(question)}
                className="w-full text-left p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 text-xs sm:text-sm text-slate-300 hover:text-white transition cursor-pointer"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* CTA to create account */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 mb-2">Want your own message board?</p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition"
          >
            <User className="w-3.5 h-3.5" />
            <span>Create Free Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
