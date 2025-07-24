// pages/admin/flashcard-manager.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Flashcard {
  id: number;
  term: string;
  definition: string;
  category: string;
  example?: string;
  pronunciation?: string;
  synonyms?: string[];
}

export default function FlashcardManager() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [newCard, setNewCard] = useState<Partial<Flashcard>>({ term: '', definition: '', category: '' });
  const [editCard, setEditCard] = useState<Flashcard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const { data, error } = await supabase.from('flashcards').select('*');
      if (error) setError('Failed to load flashcards.');
      else setFlashcards(data);
    };
    fetchFlashcards();
  }, []);

  const addOrUpdateFlashcard = async () => {
    if (!newCard.term || !newCard.definition || !newCard.category) {
      setError('Term, definition, and category are required.');
      return;
    }
    setError(null);
    if (editCard) {
      const { error } = await supabase.from('flashcards').update(newCard).eq('id', editCard.id);
      if (!error) {
        setFlashcards(flashcards.map(card => (card.id === editCard.id ? { ...card, ...newCard } : card)));
        setEditCard(null);
        setNewCard({ term: '', definition: '', category: '' });
      } else {
        setError('Failed to update flashcard.');
      }
    } else {
      const { data, error } = await supabase.from('flashcards').insert([newCard]).select().single();
      if (!error && data) {
        setFlashcards([...flashcards, data]);
        setNewCard({ term: '', definition: '', category: '' });
      } else {
        setError('Failed to add flashcard.');
      }
    }
  };

  const deleteFlashcard = async (id: number) => {
    const { error } = await supabase.from('flashcards').delete().eq('id', id);
    if (!error) {
      setFlashcards(flashcards.filter(card => card.id !== id));
    } else {
      setError('Failed to delete flashcard.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Flashcards</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-8 bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">{editCard ? 'Edit Flashcard' : 'Add Flashcard'}</h2>
        <input
          type="text"
          placeholder="Term"
          value={newCard.term || ''}
          onChange={(e) => setNewCard({ ...newCard, term: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Definition"
          value={newCard.definition || ''}
          onChange={(e) => setNewCard({ ...newCard, definition: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Category"
          value={newCard.category || ''}
          onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <button onClick={addOrUpdateFlashcard} className="bg-blue-600 text-white px-4 py-2 rounded">
          {editCard ? 'Update' : 'Add'} Flashcard
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {flashcards.map(card => (
          <div key={card.id} className="bg-white p-4 rounded-xl shadow flex justify-between">
            <div>
              <h3 className="font-semibold">{card.term}</h3>
              <p className="text-gray-600">{card.definition}</p>
              <p className="text-sm text-gray-500">Category: {card.category}</p>
            </div>
            <div>
              <button onClick={() => setEditCard(card)} className="text-blue-600 mr-2">Edit</button>
              <button onClick={() => deleteFlashcard(card.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}