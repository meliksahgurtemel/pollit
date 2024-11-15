'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const steps = [
  {
    title: 'Vote in Polls',
    description: 'Participate in community polls and share your opinion',
    emoji: '🗳️'
  },
  {
    title: 'Earn Points',
    description: 'Get points for each poll you participate in',
    emoji: '🏆'
  },
  {
    title: 'Get Rewards',
    description: 'Convert your points into tokens and rewards',
    emoji: '✨'
  }
];

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextSlide = () => {
    setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

  return (
    <div className="w-full py-6">
      <div className="relative px-12">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentStep * 100}%)` }}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 px-2"
              >
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
                  <div className="flex justify-center mb-4">
                    <span className="text-5xl">{step.emoji}</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-center">{step.title}</h3>
                  <p className="text-sm text-zinc-400 text-center">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-zinc-800"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-zinc-800"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                currentStep === index ? 'bg-white' : 'bg-zinc-700'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}