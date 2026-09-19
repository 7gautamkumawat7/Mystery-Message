'use client';

import React from 'react';
import { Message } from '@/app/model/User';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/app/types/ApiResponse';
import { Trash2, Clock } from 'lucide-react';

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: 'Success',
        description: response.data.message,
      });
      onMessageDelete(String(message._id));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data?.message || 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  const formattedDate = message.createdAt
    ? new Date(message.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
      <div className="flex items-start justify-between gap-4">
        <p className="text-slate-100 font-medium text-base whitespace-pre-wrap leading-relaxed break-words">
          {message.content}
        </p>
        <button
          onClick={handleDeleteConfirm}
          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition cursor-pointer shrink-0"
          title="Delete message"
          aria-label="Delete message"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {formattedDate && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs text-slate-500 gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
      )}
    </div>
  );
}

export default MessageCard;
