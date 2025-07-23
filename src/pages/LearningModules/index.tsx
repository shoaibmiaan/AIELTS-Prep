// File: pages/LearningModules.tsx
'use client';
import React from 'react';
import Link from 'next/link';

const LearningModulePreviewSection = () => {
  return (
    <section className="py-20 bg-[rgb(var(--color-background))] dark:bg-[rgb(var(--color-card))]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-[rgb(var(--color-foreground))] dark:text-[rgb(var(--color-foreground))] tracking-tight">
          Structured Learning Paths
        </h2>
        <p className="text-center text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted))] max-w-3xl mx-auto mb-12">
          Progress through carefully designed courses tailored to your target band score.
        </p>

        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl shadow-lg">
            <button className="px-6 py-3 text-lg font-medium rounded-l-xl bg-[rgb(var(--color-primary))] text-[rgb(var(--color-foreground))]">
              Academic
            </button>
            <button className="px-6 py-3 text-lg font-medium bg-[rgb(var(--color-background))] dark:bg-[rgb(var(--color-card))] text-[rgb(var(--color-text))] dark:text-[rgb(var(--color-foreground))]">
              General Training
            </button>
            <button className="px-6 py-3 text-lg font-medium rounded-r-xl bg-[rgb(var(--color-background))] dark:bg-[rgb(var(--color-card))] text-[rgb(var(--color-text))] dark:text-[rgb(var(--color-foreground))]">
              Beginner to Advanced
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Lesson 1 */}
          <div className="border-2 border-[rgb(var(--color-border))] dark:border-[rgb(var(--color-border))] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <span className="text-sm font-medium text-[rgb(var(--color-warning))] dark:text-[rgb(var(--color-warning-light))] bg-[rgb(var(--color-warning-light))] dark:bg-[rgb(var(--color-warning-dark))] px-3 py-1 rounded-full">
                  Grammar
                </span>
                <span className="text-sm text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted))]">70%</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[rgb(var(--color-foreground))] dark:text-[rgb(var(--color-foreground))]">Complex Sentences</h3>
              <p className="text-[rgb(var(--color-text))] dark:text-[rgb(var(--color-foreground))] text-sm mb-4">
                Master compound-complex structures for Band 7+ writing.
              </p>
              <div className="w-full bg-[rgb(var(--color-border))] dark:bg-[rgb(var(--color-card))] rounded-full h-2.5">
                <div className="bg-[rgb(var(--color-warning))] h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="bg-[rgb(var(--color-card))] dark:bg-[rgb(var(--color-background))] px-6 py-4 border-t-2 border-[rgb(var(--color-border))] dark:border-[rgb(var(--color-border))] flex justify-between items-center">
              <span className="text-sm text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted))]">
                <i className="far fa-clock mr-2"></i> 25 min
              </span>
              <Link href="/lessons/complex-sentences">
                <button className="text-sm text-[rgb(var(--color-warning))] dark:text-[rgb(var(--color-warning-light))] font-medium hover:underline transition-all duration-300">
                  Continue
                </button>
              </Link>
            </div>
          </div>

          {/* Lesson 2 */}
          <div className="border-2 border-[rgb(var(--color-border))] dark:border-[rgb(var(--color-border))] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <span className="text-sm font-medium text-[rgb(var(--color-accent))] dark:text-[rgb(var(--color-accent-light))] bg-[rgb(var(--color-accent-light))] dark:bg-[rgb(var(--color-accent-dark))] px-3 py-1 rounded-full">
                  Listening
                </span>
                <span className="text-sm text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted))]">Locked</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[rgb(var(--color-foreground))] dark:text-[rgb(var(--color-foreground))]">Map Labelling</h3>
              <p className="text-[rgb(var(--color-text))] dark:text-[rgb(var(--color-foreground))] text-sm mb-4">
                Strategies for Section 2 map-based questions.
              </p>
              <div className="w-full bg-[rgb(var(--color-border))] dark:bg-[rgb(var(--color-card))] rounded-full h-2.5">
                <div className="bg-[rgb(var(--color-border))] dark:bg-[rgb(var(--color-card))] h-2.5 rounded-full"></div>
              </div>
            </div>
            <div className="bg-[rgb(var(--color-card))] dark:bg-[rgb(var(--color-background))] px-6 py-4 border-t-2 border-[rgb(var(--color-border))] dark:border-[rgb(var(--color-border))] flex justify-between items-center">
              <span className="text-sm text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted))]">
                <i className="far fa-clock mr-2"></i> 35 min
              </span>
              <button className="text-sm text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted))] font-medium cursor-not-allowed" disabled>
                Complete Previous
              </button>
            </div>
          </div>

          {/* Lesson 3 */}
          <div className="border-2 border-[rgb(var(--color-border))] dark:border-[rgb(var(--color-border))] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <span className="text-sm font-medium text-[rgb(var(--color-secondary))] dark:text-[rgb(var(--color-secondary-light))] bg-[rgb(var(--color-secondary-light))] dark:bg-[rgb(var(--color-secondary-dark))] px-3 py-1 rounded-full">
                  Speaking
                </span>
                <span className="text-sm text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted))]">50%</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[rgb(var(--color-foreground))] dark:text-[rgb(var(--color-foreground))]">Part 3 Strategies</h3>
              <p className="text-[rgb(var(--color-text))] dark:text-[rgb(var(--color-foreground))] text-sm mb-4">
                Develop extended answers for abstract questions.
              </p>
              <div className="w-full bg-[rgb(var(--color-border))] dark:bg-[rgb(var(--color-card))] rounded-full h-2.5">
                <div className="bg-[rgb(var(--color-secondary))] h-2.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div className="bg-[rgb(var(--color-card))] dark:bg-[rgb(var(--color-background))] px-6 py-4 border-t-2 border-[rgb(var(--color-border))] dark:border-[rgb(var(--color-border))] flex justify-between items-center">
              <span className="text-sm text-[rgb(var(--color-muted))] dark:text-[rgb(var(--color-muted))]">
                <i className="far fa-clock mr-2"></i> 45 min
              </span>
              <Link href="/lessons/part-3-strategies">
                <button className="text-sm text-[rgb(var(--color-secondary))] dark:text-[rgb(var(--color-secondary-light))] font-medium hover:underline transition-all duration-300">
                  Continue
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningModulePreviewSection;