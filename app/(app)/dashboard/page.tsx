'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Message } from '@/app/model/User';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/app/types/ApiResponse';
import MessageCard from '@/components/ui/MessageCard';
import {
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Inbox,
  Link as LinkIcon,
  ShieldAlert,
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => String(msg._id) !== messageId));
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setAcceptMessages(
        response.data.isAcceptingMessage ?? response.data.isAcceptingMessages ?? false
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data?.message ||
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data?.message || 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/sign-in');
    }
  }, [status, router]);

  useEffect(() => {
    if (session && session.user) {
      fetchMessages();
      fetchAcceptMessage();
    }
  }, [session, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    const nextVal = !acceptMessages;
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: nextVal,
      });
      setAcceptMessages(nextVal);
      toast({
        title: response.data.message || 'Status updated',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data?.message ||
          'Failed to update message acceptance status',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  const username = session.user.username || '';
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast({
      title: 'URL Copied!',
      description: 'Profile link has been copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          User Dashboard
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-1">
          Manage your unique link and incoming anonymous messages.
        </p>
      </div>

      {/* Copy Profile Link Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-blue-400" />
          <span>Copy Your Unique Link</span>
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none select-all"
          />
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm transition shrink-0 cursor-pointer shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Accept Messages Switch & Refresh Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={acceptMessages}
            disabled={isSwitchLoading}
            onClick={handleSwitchChange}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
              acceptMessages ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                acceptMessages ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-sm font-medium text-slate-200">
            Accept Messages:{' '}
            <span className={acceptMessages ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
              {acceptMessages ? 'On' : 'Off'}
            </span>
          </span>
          {isSwitchLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
        </div>

        <button
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Messages</span>
        </button>
      </div>

      {/* Messages Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>Received Messages</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400">
            {messages.length}
          </span>
        </h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm">Loading messages...</p>
          </div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {messages.map((message) => (
              <MessageCard
                key={String(message._id)}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">No messages yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Share your link with friends or on social media to start receiving anonymous feedback!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
