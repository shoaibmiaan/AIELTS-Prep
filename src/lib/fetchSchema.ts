import { supabase } from './supabaseClient';

// Interface for the schema structure
interface Column {
  name: string;
  data_type: string;
  is_nullable: 'YES' | 'NO';
}

interface TableSchema {
  table_name: string;
  columns: Column[];
}

export async function fetchSchema(): Promise<Record<string, TableSchema>> {
  try {
    // Fetch schema for relevant tables
    const tables = ['reading_papers', 'reading_passages', 'reading_questions'];
    const schema: Record<string, TableSchema> = {};

    for (const table of tables) {
      const { data, error } = await supabase.rpc('get_table_columns', { table_name: table });

      if (error) {
        console.error(`Error fetching schema for ${table}:`, error.message);
        throw error;
      }

      schema[table] = {
        table_name: table,
        columns: data as Column[],
      };
    }

    return schema;
  } catch (error) {
    console.error('Failed to fetch schema:', error);
    // Fallback to a default schema if fetch fails
    return {
      reading_papers: {
        table_name: 'reading_papers',
        columns: [
          { name: 'id', data_type: 'integer', is_nullable: 'NO' },
          { name: 'paper_id', data_type: 'text', is_nullable: 'YES' },
          { name: 'title', data_type: 'text', is_nullable: 'NO' },
          { name: 'type', data_type: 'text', is_nullable: 'NO' },
          { name: 'instructions', data_type: 'text', is_nullable: 'YES' },
        ],
      },
      reading_passages: {
        table_name: 'reading_passages',
        columns: [
          { name: 'id', data_type: 'integer', is_nullable: 'NO' },
          { name: 'paper_id', data_type: 'integer', is_nullable: 'NO' },
          { name: 'passage_number', data_type: 'integer', is_nullable: 'NO' },
          { name: 'passage_title', data_type: 'text', is_nullable: 'NO' },
          { name: 'passage_text', data_type: 'text', is_nullable: 'YES' },
          { name: 'instruction', data_type: 'text', is_nullable: 'YES' },
        ],
      },
      reading_questions: {
        table_name: 'reading_questions',
        columns: [
          { name: 'id', data_type: 'integer', is_nullable: 'NO' },
          { name: 'passage_id', data_type: 'integer', is_nullable: 'NO' },
          { name: 'question_number', data_type: 'integer', is_nullable: 'NO' },
          { name: 'question_type', data_type: 'text', is_nullable: 'NO' },
          { name: 'question_text', data_type: 'text', is_nullable: 'NO' },
          { name: 'instruction', data_type: 'text', is_nullable: 'YES' },
          { name: 'options', data_type: 'jsonb', is_nullable: 'YES' },
          { name: 'correct_answer', data_type: 'jsonb', is_nullable: 'YES' },
          { name: 'explanation', data_type: 'text', is_nullable: 'YES' },
        ],
      },
    };
  }
}

// Optional: Create a custom RPC function in Supabase if needed
// Run this SQL in Supabase SQL Editor to create the function:
// CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
// RETURNS TABLE (name text, data_type text, is_nullable text) AS $$
// BEGIN
//   RETURN QUERY
//   SELECT column_name, data_type, is_nullable
//   FROM information_schema.columns
//   WHERE table_schema = 'public'
//     AND table_name = lower(get_table_columns.table_name);
// END;
// $$ LANGUAGE plpgsql;