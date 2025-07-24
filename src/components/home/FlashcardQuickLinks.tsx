import React from 'react';
import { colors, typography, spacing, borderRadius, gradients, shadows } from '@/constants/designSystem';

const FlashcardQuickLinks = ({ onStartFlashcards, darkMode }: {
  onStartFlashcards: () => void;
  darkMode: boolean;
}) => {
  const categories = [
    {
      id: 'academic',
      title: 'Academic Vocabulary',
      count: 120,
      icon: 'graduation-cap',
      color: colors.info,
    },
    {
      id: 'common',
      title: 'Common Phrases',
      count: 85,
      icon: 'comments',
      color: colors.success,
    },
    {
      id: 'writing',
      title: 'Writing Expressions',
      count: 65,
      icon: 'pen',
      color: colors.warning,
    },
    {
      id: 'speaking',
      title: 'Speaking Idioms',
      count: 42,
      icon: 'microphone',
      color: colors.danger,
    },
  ];

  return (
    <div className="mb-10">
      <h2
        className={`text-xl font-${typography.fontWeight.semibold} mb-${spacing.md}`}
        style={{ color: darkMode ? colors.text : colors.flat.text }}
      >
        Quick Vocabulary Practice
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`rounded-${borderRadius.md} p-${spacing.md} transition-all duration-300 hover:shadow-${darkMode ? 'xl' : 'lg'} cursor-pointer`}
            style={{
              background: darkMode
                ? `linear-gradient(135deg, ${colors.flat.background} 0%, #2d3748 100%)`
                : gradients.primary,
              border: `1px solid ${darkMode ? colors.flat.border : 'transparent'}`,
              color: darkMode ? colors.flat.text : '#fff',
            }}
            onClick={onStartFlashcards}
          >
            <div className="flex items-center mb-2">
              <div
                className="rounded-full p-2 mr-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: category.color,
                }}
              >
                <i className={`fas fa-${category.icon} text-lg`}></i>
              </div>
              <h3
                className={`text-${typography.fontSize.base} font-${typography.fontWeight.medium}`}
                style={{ color: darkMode ? colors.text : '#fff' }}
              >
                {category.title}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-80">{category.count} cards</span>
              <button
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  color: darkMode ? colors.text : '#fff',
                }}
              >
                Practice Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onStartFlashcards}
          className={`px-6 py-3 rounded-${borderRadius.md} font-${typography.fontWeight.semibold} transition-all duration-300 hover:scale-105`}
          style={{
            background: gradients.success,
            color: '#fff',
            boxShadow: shadows.md,
          }}
        >
          <i className="fas fa-layer-group mr-2"></i>
          View All Flashcard Sets
        </button>
      </div>
    </div>
  );
};

export default FlashcardQuickLinks;
