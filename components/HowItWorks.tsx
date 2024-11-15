'use client';

import { useState, TouchEvent } from 'react';
import { cn } from '@/lib/utils';

const steps = [
  {
    title: 'Vote in Polls',
    description: 'Participate in polls and share your opinion',
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
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    // Minimum swipe distance of 50px
    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      // Swipe left
      setCurrentStep((prev) => (prev === steps.length - 1 ? prev : prev + 1));
    } else {
      // Swipe right
      setCurrentStep((prev) => (prev === 0 ? prev : prev - 1));
    }

    setTouchStart(null);
  };

  return (
    <div className="w-full">
      <div
        className="overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 px-4"
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

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-colors',
              currentStep === index ? 'bg-white' : 'bg-zinc-700'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}