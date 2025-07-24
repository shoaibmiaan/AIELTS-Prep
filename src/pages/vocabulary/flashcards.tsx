import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useTheme } from '../../components/ThemeProvider'; // Updated import path

interface Flashcard {
  id: number;
  term: string;
  definition: string;
  category: string;
  example?: string;
  pronunciation?: string;
  synonyms?: string[];
  difficulty?: number;
  last_reviewed?: string;
}

const FlashcardsPage = () => {
  const { theme } = useTheme();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isFlipped, setIsFlipped] = useState<boolean[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [difficultCards, setDifficultCards] = useState<number[]>([]);
  const [studyMode, setStudyMode] = useState<'all' | 'new' | 'difficult'>('all');
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  const [isShuffled, setIsShuffled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [timer, setTimer] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const { data, error } = await supabase.from('flashcards').select('*');
      if (error) {
        console.error('Error fetching flashcards:', error);
      } else {
        const uniqueCategories = ['all', ...new Set(data.map((card: Flashcard) => card.category))];
        setCategories(uniqueCategories);
        setFlashcards(data);
        setIsFlipped(new Array(data.length).fill(false));
      }
    };
    fetchFlashcards();

    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  // Fix: Added safe access to filteredFlashcards
  const filteredFlashcards = flashcards.filter(card => {
    if (studyMode === 'new' && knownCards.includes(card.id)) return false;
    if (studyMode === 'difficult' && !difficultCards.includes(card.id)) return false;
    if (selectedCategory !== 'all' && card.category !== selectedCategory) return false;
    return true;
  });

  useEffect(() => {
    const totalCards = filteredFlashcards.length;
    const knownCount = knownCards.filter(id =>
      filteredFlashcards.some(card => card.id === id)
    ).length;
    setProgress(totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0);
  }, [knownCards, flashcards, studyMode, selectedCategory, filteredFlashcards]);

  useEffect(() => {
    let flipTimer: NodeJS.Timeout;
    if (autoFlip && filteredFlashcards.length > 0 && !isFlipped[currentCard]) {
      flipTimer = setTimeout(() => {
        handleFlip(currentCard);
      }, timer * 1000);
    }
    return () => clearTimeout(flipTimer);
  }, [autoFlip, currentCard, isFlipped, timer, filteredFlashcards]);

  const handleFlip = (index: number) => {
    if (index >= filteredFlashcards.length) return; // Added safety check

    const updatedFlipState = [...isFlipped];
    updatedFlipState[index] = !updatedFlipState[index];
    setIsFlipped(updatedFlipState);

    if (voiceEnabled && speechSynthesis && filteredFlashcards[index]) {
      const utterance = new SpeechSynthesisUtterance(
        updatedFlipState[index]
          ? filteredFlashcards[index].definition
          : filteredFlashcards[index].term
      );
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const markAsKnown = (id: number) => {
    if (!knownCards.includes(id)) {
      setKnownCards([...knownCards, id]);
    }
    if (difficultCards.includes(id)) {
      setDifficultCards(difficultCards.filter(cardId => cardId !== id));
    }
    if (currentCard < filteredFlashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const markAsDifficult = (id: number) => {
    if (!difficultCards.includes(id)) {
      setDifficultCards([...difficultCards, id]);
    }
    if (currentCard < filteredFlashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const resetStudySession = () => {
    setKnownCards([]);
    setDifficultCards([]);
    setCurrentCard(0);
    setIsFlipped(new Array(flashcards.length).fill(false));
  };

  const shuffleCards = () => {
    const shuffled = [...filteredFlashcards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFlashcards(shuffled);
    setIsShuffled(true);
    setCurrentCard(0);
  };

  const nextCard = () => {
    if (currentCard < filteredFlashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleAutoFlipToggle = () => {
    if (!autoFlip && filteredFlashcards.length > 0) {
      handleFlip(currentCard);
    }
    setAutoFlip(!autoFlip);
  };

  // Fix: Moved below the filteredFlashcards declaration
  const currentFlashcard = filteredFlashcards[currentCard] || null;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 pt-16`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress: {progress}%
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
              >
                <i className="fas fa-cog mr-1"></i> Settings
              </button>
              <button
                onClick={() => setShowProgress(!showProgress)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showProgress ? 'Hide' : 'Details'}
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {showSettings && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Study Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoFlip"
                    checked={autoFlip}
                    onChange={handleAutoFlipToggle}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="autoFlip" className="ml-2 text-gray-700 dark:text-gray-300">
                    Auto-flip cards
                  </label>
                </div>

                {autoFlip && (
                  <div className="flex items-center">
                    <label className="mr-2 text-gray-700 dark:text-gray-300">Flip after:</label>
                    <select
                      value={timer}
                      onChange={(e) => setTimer(Number(e.target.value))}
                      className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1"
                    >
                      {[3, 5, 10, 15, 20, 30].map((sec) => (
                        <option key={sec} value={sec}>
                          {sec} seconds
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="voiceEnabled"
                    checked={voiceEnabled}
                    onChange={() => setVoiceEnabled(!voiceEnabled)}
                    disabled={!speechSynthesis}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="voiceEnabled" className="ml-2 text-gray-700 dark:text-gray-300">
                    Text-to-Speech {!speechSynthesis && "(Unavailable)"}
                  </label>
                </div>
              </div>
            </div>
          )}

          {showProgress && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                <h3 className="font-semibold text-green-700 dark:text-green-400">Mastered</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-300">{knownCards.length} words</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg">
                <h3 className="font-semibold text-yellow-700 dark:text-yellow-400">Difficult</h3>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{difficultCards.length} words</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-700 dark:text-blue-400">Total</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{filteredFlashcards.length} words</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStudyMode('all')}
              className={`px-4 py-2 rounded-full transition-all ${
                studyMode === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Words
            </button>
            <button
              onClick={() => setStudyMode('new')}
              className={`px-4 py-2 rounded-full transition-all ${
                studyMode === 'new'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              New Words
            </button>
            <button
              onClick={() => setStudyMode('difficult')}
              className={`px-4 py-2 rounded-full transition-all ${
                studyMode === 'difficult'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Difficult Words
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center hover:bg-indigo-200 dark:hover:bg-indigo-800/70 transition-colors"
            >
              <i className="fas fa-tag mr-2"></i>
              {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
            </button>
            <button
              onClick={shuffleCards}
              className="px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full flex items-center hover:bg-purple-200 dark:hover:bg-purple-800/70 transition-colors"
            >
              <i className={`fas fa-random mr-2 ${isShuffled ? 'text-green-500' : ''}`}></i>
              Shuffle
            </button>
            <button
              onClick={resetStudySession}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full flex items-center hover:bg-red-200 dark:hover:bg-red-800/70 transition-colors"
            >
              <i className="fas fa-redo mr-2"></i>
              Reset Session
            </button>
          </div>
        </div>

        {showCategories && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Select Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowCategories(false);
                  }}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center mb-12">
          {filteredFlashcards.length > 0 ? (
            <div className="w-full max-w-2xl">
              <div className="text-center mb-4 text-gray-600 dark:text-gray-400">
                Card {currentCard + 1} of {filteredFlashcards.length}
                {autoFlip && (
                  <span className="ml-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-sm">
                    Auto-flip: {timer}s
                  </span>
                )}
              </div>
              <div
                className={`relative h-96 cursor-pointer perspective-1000 mb-8 ${
                  currentFlashcard && isFlipped[currentCard] ? 'flipped' : ''
                }`}
                onClick={() => handleFlip(currentCard)}
              >
                <div className="card-inner relative w-full h-full transition-transform duration-700 transform-style-3d">
                  <div
                    className={`card-front absolute w-full h-full backface-hidden rounded-2xl shadow-xl flex flex-col justify-center items-center p-8 ${
                      currentFlashcard && knownCards.includes(currentFlashcard.id)
                        ? 'bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-300 dark:from-green-900/30 dark:to-green-800/30 dark:border-green-700'
                        : currentFlashcard && difficultCards.includes(currentFlashcard.id)
                        ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-yellow-300 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:border-yellow-700'
                        : 'bg-gradient-to-br from-white to-blue-50 border-4 border-blue-200 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600'
                    }`}
                  >
                    {currentFlashcard && (
                      <>
                        <div className="absolute top-4 right-4">
                          {knownCards.includes(currentFlashcard.id) && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                              <i className="fas fa-check mr-1"></i> Mastered
                            </span>
                          )}
                          {difficultCards.includes(currentFlashcard.id) && (
                            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                              <i className="fas fa-exclamation-triangle mr-1"></i> Difficult
                            </span>
                          )}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-6">
                          {currentFlashcard.term}
                        </h2>
                        {currentFlashcard.pronunciation && (
                          <p className="text-gray-500 dark:text-gray-400 mb-2">
                            /{currentFlashcard.pronunciation}/
                          </p>
                        )}
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-300 italic">
                            Click to flip
                          </p>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Category: {currentFlashcard.category || 'General'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="card-back absolute w-full h-full backface-hidden rounded-2xl shadow-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 p-8 transform-rotate-y-180 flex flex-col justify-center">
                    {currentFlashcard && (
                      <>
                        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
                          Definition
                        </h3>
                        <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-6">
                          {currentFlashcard.definition}
                        </p>
                        {currentFlashcard.example && (
                          <div className="bg-blue-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
                            <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Example:</h4>
                            <p className="text-gray-700 dark:text-gray-300 italic">
                              "{currentFlashcard.example}"
                            </p>
                          </div>
                        )}
                        {currentFlashcard.synonyms && currentFlashcard.synonyms.length > 0 && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6">
                            <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Synonyms:</h4>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {currentFlashcard.synonyms.map((synonym, idx) => (
                                <span key={idx} className="bg-purple-100 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
                                  {synonym}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex justify-center gap-4 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsDifficult(currentFlashcard.id);
                            }}
                            className={`px-4 py-2 rounded-full flex items-center transition-all ${
                              difficultCards.includes(currentFlashcard.id)
                                ? 'bg-yellow-500 text-white shadow-md'
                                : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800/70'
                            }`}
                          >
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            Difficult
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsKnown(currentFlashcard.id);
                            }}
                            className={`px-4 py-2 rounded-full flex items-center transition-all ${
                              knownCards.includes(currentFlashcard.id)
                                ? 'bg-green-500 text-white shadow-md'
                                : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/70'
                            }`}
                          >
                            <i className="fas fa-check mr-2"></i>
                            I Know This
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={prevCard}
                  disabled={currentCard === 0}
                  className={`px-6 py-3 rounded-full flex items-center transition-all ${
                    currentCard === 0
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Previous
                </button>
                <button
                  onClick={nextCard}
                  disabled={currentCard === filteredFlashcards.length - 1}
                  className={`px-6 py-3 rounded-full flex items-center transition-all ${
                    currentCard === filteredFlashcards.length - 1
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Next
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 w-full">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <i className="fas fa-inbox text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <h3 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">No flashcards found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {studyMode === 'new'
                    ? "You've mastered all words in this category!"
                    : studyMode === 'difficult'
                    ? "No difficult words in this category yet"
                    : "No words match your filters"}
                </p>
                <button
                  onClick={() => {
                    setStudyMode('all');
                    setSelectedCategory('all');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Show All Flashcards
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Effective Flashcard Study Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-1 mr-4">
                <i className="fas fa-sync-alt text-blue-600 dark:text-blue-400"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Spaced Repetition</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Review difficult cards more frequently. Our system tracks words you mark as difficult and prioritizes them.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-1 mr-4">
                <i className="fas fa-check-circle text-green-600 dark:text-green-400"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Active Recall</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try to recall the definition before flipping the card. This strengthens memory retention.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mt-1 mr-4">
                <i className="fas fa-random text-yellow-600 dark:text-yellow-400"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Shuffle Regularly</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Avoid memorizing word order. Shuffle your deck to ensure you're truly learning each word.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-1 mr-4">
                <i className="fas fa-chart-line text-purple-600 dark:text-purple-400"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Track Progress</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor your progress and focus on words you haven't mastered yet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .transform-rotate-y-180 {
          transform: rotateY(180deg);
        }
        .card-inner {
          transition: transform 0.6s;
          transform-style: preserve-3d;
          position: relative;
          width: 100%;
          height: 100%;
        }
        .flipped .card-inner {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default FlashcardsPage;