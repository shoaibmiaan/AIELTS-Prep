import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { term, definition } = req.body;

    const { data, error } = await supabase
      .from('flashcards')
      .insert([{ term, definition }]);

    if (error) {
      return res.status(500).json({ message: 'Error saving flashcard', error });
    }

    return res.status(200).json({ data });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
