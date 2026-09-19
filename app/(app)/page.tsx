"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/message.json";
import {
  MessageSquare,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  Zap,
  Clock,
  EyeOff,
} from "lucide-react";

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Ambient background glow elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs sm:text-sm font-medium mb-6 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>True Anonymous Messaging Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-slate-400">100% Confidential</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Dive into the World of{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Anonymous Feedback
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Mystery Message lets your audience, friends, and peers share genuine thoughts,
          constructive critiques, and secret questions — with zero identity exposure.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-slate-800 hover:border-slate-700 transition cursor-pointer backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Open Dashboard</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-xs text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>100% Anonymous</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Message Prompts</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant Real-Time</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Safe & Spam Protected</span>
          </div>
        </div>
      </section>

      {/* Featured Messages Carousel Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Live Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            See What People Are Sharing
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            Experience real-world examples of authentic messages sent through Mystery Message.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative px-2 sm:px-12">
          <Carousel
            setApi={setApi}
            plugins={[
              Autoplay({
                delay: 3500,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="md:basis-1/1">
                  <div className="p-1">
                    <Card className="bg-slate-900/90 border-slate-800/90 hover:border-slate-700 shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300">
                      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <CardTitle className="text-sm sm:text-base font-semibold text-white">
                              {message.title}
                            </CardTitle>
                            <span className="text-xs text-slate-500">Anonymous Sender</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/70 px-2.5 py-1 rounded-md border border-slate-800">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{message.received}</span>
                        </div>
                      </CardHeader>

                      <CardContent className="py-8 sm:py-10 px-6 sm:px-8 flex flex-col justify-center">
                        <div className="relative">
                          <MessageSquareQuote className="w-8 h-8 text-blue-500/20 absolute -top-4 -left-3 pointer-events-none" />
                          <p className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed italic pl-6">
                            &ldquo;{message.content}&rdquo;
                          </p>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-3 pb-3 border-t border-slate-800/60 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>End-to-End Anonymous</span>
                        </div>
                        <span className="text-slate-500">Card #{index + 1}</span>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Previous & Next Controls */}
            <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-6 bg-slate-900/90 border-slate-800 hover:bg-slate-800 hover:text-white text-slate-300 shadow-lg cursor-pointer" />
            <CarouselNext className="hidden sm:flex -right-4 sm:-right-6 bg-slate-900/90 border-slate-800 hover:bg-slate-800 hover:text-white text-slate-300 shadow-lg cursor-pointer" />
          </Carousel>

          {/* Slide Indicator Dots */}
          {count > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    current === index + 1
                      ? "w-8 h-2 bg-blue-500"
                      : "w-2 h-2 bg-slate-700 hover:bg-slate-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-900/80">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Mystery Message Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-md mx-auto">
            Get started in 3 easy steps and begin collecting authentic feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative flex flex-col justify-between hover:border-slate-700 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-semibold text-white">Create Your Profile</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sign up in seconds to receive your personalized, secure public message link.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative flex flex-col justify-between hover:border-slate-700 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-semibold text-white">Share Your Link</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Paste your link on Instagram bio, WhatsApp status, Discord, or X so anyone can send messages.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative flex flex-col justify-between hover:border-slate-700 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-semibold text-white">Read & Respond with AI</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                View incoming messages in your private dashboard and use AI to generate questions or replies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 space-y-3 hover:border-slate-700/80 transition">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Total Sender Anonymity</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No login or account is required for senders. We never log or expose sender identities.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 space-y-3 hover:border-slate-700/80 transition">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">AI Suggestion Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Visitors can generate thoughtful, engaging questions with one click using our integrated AI prompt helper.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 space-y-3 hover:border-slate-700/80 transition">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Message Acceptance Switch</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Control when you want to receive feedback with a simple toggle switch right in your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900/40 via-indigo-950/60 to-purple-950/40 border border-blue-500/20 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 bg-radial from-blue-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Hear What People Really Think?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
              Create your free account today and discover authentic feedback from friends, colleagues, and followers.
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.03] cursor-pointer"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

