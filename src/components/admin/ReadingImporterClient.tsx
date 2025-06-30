'use client';

// Importing necessary modules and components
import { importReadingPaper } from "@/core/importReadingPaper";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { DataGrid, SelectColumn } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import ReadingPreview from '@/components/admin/ReadingPreview';
import AIWaitOverlay from '@/components/AIWaitOverlay';
import readingSchemaExample from '@/data/reading-tests/test2.json';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { debounce } from 'lodash';
import { FiUpload, FiDownload, FiTrash2, FiCheck, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import clsx from 'clsx';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { allowedReadingQuestionTypes, ReadingQuestionType, readingQuestionTypeMap } from '@/utils/readingQuestionTypes';
import { findBestMatch } from 'string-similarity';

// Defining a reusable Button component with variant styling
const Button = ({ variant = 'primary', children, className, ...props }) => (
  <button
    className={clsx(
      'px-4 py-2 rounded transition-colors flex items-center gap-2',
      variant === 'primary' && 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
      variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
      variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
      variant === 'success' && 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

// Parsing raw IELTS reading text to JSON format
function parseIeltsReadingTextToJson(rawText: string): string {
  console.log('Parsing raw text:', rawText.substring(0, 100)); // Debug: Log first 100 chars
  const titleMatch = rawText.match(/Reading Test \d+/i);
  const title = titleMatch ? titleMatch[0].trim() : 'IELTS Academic Reading';
  const sectionBlocks = rawText.split(/Section \d+/i).filter(x => x.trim().length > 0); // Splitting text into sections

  const passages = sectionBlocks.map((block, idx) => {
    console.log(`Processing block ${idx + 1}:`, block.substring(0, 100)); // Debug: Log each block
    const passageTitleMatch = block.match(/based on Reading Passage[^\n]*\n([^\n]+)/i);
    const passageTitle = passageTitleMatch ? passageTitleMatch[1].trim() : `Passage ${idx + 1}`;
    const passageTextMatch = block.match(/based on Reading Passage[^\n]*\n[^\n]+\n([\s\S]*?)(?:Question\s*\d+|\n\n|$)/i);
    const passageText = passageTextMatch ? passageTextMatch[1].replace(/\n+/g, ' ').trim() : block.trim();
    const instructionMatch = block.match(/Instructions?:[\s\S]*?(?=\n\n|\nQuestions?|$)/i);
    const instruction = instructionMatch ? instructionMatch[0].replace(/Instructions?:/i, '').trim() : null;

    const questions: any[] = [];
    const questionRegex = /Question\s*(\d+)[\.\)]?\s+([^\n]+?)(?=\s*Question\s*\d+|\n\n|$)/gis;
    let match;
    while ((match = questionRegex.exec(block)) !== null) {
      const questionNumber = Number(match[1]);
      const questionText = match[2].trim();
      const questionInstructionMatch = block.match(new RegExp(`Question\\s*${match[1]}[\\.\\)]?\\s+${questionText}[\\s\\S]*?(?=Instructions?:|Question\\s*\\d+|\n\n|$)`));
      const questionInstruction = questionInstructionMatch ? questionInstructionMatch[0].replace(new RegExp(`Question\\s*${match[1]}[\\.\\)]?\\s+${questionText}`), '').trim() : null;

      let questionType = "Unknown" as ReadingQuestionType;
      if (/headings/i.test(block)) questionType = "Matching Headings";
      else if (/features/i.test(block)) questionType = "Matching Features";
      else if (/information/i.test(block)) questionType = "Matching Information";
      else if (/sentence endings/i.test(block)) questionType = "Matching Sentence Endings";

      questions.push({
        question_number: questionNumber,
        question_type: questionType,
        question_text: questionText,
        instruction: questionInstruction,
        options: null,
        correct_answer: "",
        status: "draft",
      });
    }

    return {
      passage_number: idx + 1,
      title: passageTitle,
      body: passageText,
      section_instruction: instruction,
      status: "draft",
      questions,
    };
  });

  const json = {
    title,
    type: "academic",
    status: "draft",
    passages,
  };
  console.log('Parsed JSON:', JSON.stringify(json, null, 2)); // Debug: Log full JSON
  return JSON.stringify(json, null, 2);
}

// Converting raw IELTS reading text to CSV format
function parseIeltsReadingTextToCsv(rawText: string): GridRow[] {
  const rows: GridRow[] = [];
  const sectionBlocks = rawText.split(/Section \d+/i).filter(x => x.trim().length > 30);

  sectionBlocks.forEach((block, passageIdx) => {
    const passageTitleMatch = block.match(/based on Reading Passage[^\n]*\n([^\n]+)/i);
    const passageTitle = passageTitleMatch ? passageTitleMatch[1].trim() : `Passage ${passageIdx + 1}`;
    const questionRegex = /Question\s*(\d+)[\.\)]?\s+([^\n]+?)(?=\s*Question\s*\d+|$)/gis;
    let match;
    while ((match = questionRegex.exec(block)) !== null) {
      const questionNumber = Number(match[1]);
      const questionText = match[2].trim();
      rows.push({
        id: `${passageIdx + 1}_${questionNumber}_${Date.now()}`,
        passage_number: passageIdx + 1,
        passage_title: passageTitle,
        question_number: questionNumber,
        question_text: questionText,
        question_type: 'Unknown',
        options: '',
        correct_answer: '',
        isSelected: false,
      });
    }
  });

  return rows;
}

// Defining interfaces for validation
interface ReadingQuestion {
  question_number: number;
  question_type: ReadingQuestionType | string;
  question_text?: string;
  text?: string;
  instruction?: string | null;
  options?: string[] | null;
  correct_answer?: string | string[] | null;
  answer?: string | string[] | null;
  explanation?: string | null;
  status?: string;
}

interface ReadingPassage {
  passage_number: number;
  title: string;
  body: string;
  section_instruction?: string | null;
  questions: ReadingQuestion[];
  status?: string;
}

interface ReadingPaper {
  title: string;
  type: string;
  status?: string;
  passages: ReadingPassage[];
}

// Mapping required fields for each question type
const QUESTION_TYPE_REQUIRED_FIELDS: Record<ReadingQuestionType, (keyof ReadingQuestion)[]> = {
  "Matching Headings": ["question_text", "options", "correct_answer"],
  "Matching Information": ["question_text", "options", "correct_answer"],
  "Matching Features": ["question_text", "options", "correct_answer"],
  "Matching Sentence Endings": ["question_text", "options", "correct_answer"],
  "Identifying Information (True/False/Not Given)": ["question_text", "correct_answer"],
  "Identifying Writer's Views/Claims (Yes/No/Not Given)": ["question_text", "correct_answer"],
  "Multiple Choice": ["question_text", "options", "correct_answer"],
  "List of Options": ["question_text", "options", "correct_answer"],
  "Choose a Title": ["question_text", "options", "correct_answer"],
  "Short-answer Questions": ["question_text", "correct_answer"],
  "Sentence Completion": ["question_text", "correct_answer"],
  "Summary Completion": ["question_text", "correct_answer"],
  "Table Completion": ["question_text", "correct_answer"],
  "Flow-Chart Completion": ["question_text", "correct_answer"],
  "Diagram Label Completion": ["question_text", "correct_answer"],
};

// Validating question type against allowed types
function validateQuestionType(qtype: string): ReadingQuestionType {
  const legacyTypes = [
    "Note/Table/Flow-Chart Completion",
    "Note Completion/Table Completion/Flow-chart Completion",
  ];
  if (legacyTypes.includes(qtype)) {
    throw new Error(
      `Invalid/legacy question_type: "${qtype}". Use one of these exactly: ${allowedReadingQuestionTypes.join(", ")}`
    );
  }
  const validTypes = allowedReadingQuestionTypes as readonly string[];
  if (!validTypes.includes(qtype)) {
    const matches = findBestMatch(qtype, validTypes);
    const hint = matches.bestMatch.rating > 0.3 ? ` Did you mean: '${matches.bestMatch.target}'?` : "";
    throw new Error(`Invalid question_type: "${qtype}".${hint} Must be one of: ${validTypes.join(", ")}`);
  }
  return qtype as ReadingQuestionType;
}

// Validating required fields for a question
function validateQuestionFields(question: ReadingQuestion, passageNum: number): string[] {
  const errors: string[] = [];
  try {
    validateQuestionType(question.question_type as string);
  } catch (err: any) {
    errors.push(`Passage ${passageNum} Q${question.question_number}: ${err.message}`);
    return errors;
  }

  const requiredFields = QUESTION_TYPE_REQUIRED_FIELDS[question.question_type as ReadingQuestionType];
  for (const field of requiredFields) {
    const value = field === "question_text" ? question.question_text || question.text :
                  field === "correct_answer" ? question.correct_answer || question.answer : question[field];
    if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
      errors.push(`Passage ${passageNum} Q${question.question_number}: Missing or empty field "${field}" for type "${question.question_type}".`);
    }
    if (field === "options" && Array.isArray(value) && value.length === 0) {
      errors.push(`Passage ${passageNum} Q${question.question_number}: "options" must be a non-empty array for type "${question.question_type}".`);
    }
  }
  return errors;
}

// Validating the entire reading paper
async function validateReadingPaper(paper: ReadingPaper): Promise<string[]> {
  const errors: string[] = [];
  if (!paper.title) errors.push("Missing title");
  if (!paper.type) errors.push("Missing type");
  if (!Array.isArray(paper.passages) || paper.passages.length === 0) errors.push("No passages provided");

  const passageNumbers = new Set<number>();
  for (const passage of paper.passages || []) {
    if (passageNumbers.has(passage.passage_number)) errors.push(`Duplicate passage_number: ${passage.passage_number}`);
    else passageNumbers.add(passage.passage_number);

    if (!Array.isArray(passage.questions) || passage.questions.length === 0) errors.push(`Passage ${passage.passage_number}: No questions`);
    else {
      const questionNumbers = new Set<number>();
      for (const question of passage.questions) {
        if (questionNumbers.has(question.question_number)) errors.push(`Passage ${passage.passage_number}: Duplicate question_number ${question.question_number}`);
        else questionNumbers.add(question.question_number);
        errors.push(...validateQuestionFields(question, passage.passage_number));
      }
    }
  }
  return errors;
}

// Defining the GridRow interface for CSV data
interface GridRow {
  id: string;
  passage_number: number;
  passage_title: string;
  question_number: number;
  question_text: string;
  question_type: string;
  options: string;
  correct_answer: string;
  isSelected: boolean;
}

// Defining the schema for validating reading paper data
const ReadingPaperSchema = z.object({
  title: z.string().nonempty(),
  type: z.enum(['academic', 'general']),
  status: z.string().optional(),
  passages: z.array(
    z.object({
      passage_number: z.number().int().positive(),
      title: z.string().nonempty(),
      body: z.string().nullable(),
      section_instruction: z.string().nullable(),
      questions: z.array(
        z.object({
          question_number: z.number().int().positive(),
          question_type: z.enum(allowedReadingQuestionTypes),
          question_text: z.string().nonempty().optional(),
          text: z.string().nonempty().optional(),
          instruction: z.string().nullable(),
          options: z.array(z.string()).nullable(),
          correct_answer: z.union([z.string(), z.array(z.string())]).nullable(),
          answer: z.union([z.string(), z.array(z.string())]).nullable(),
          status: z.string().optional(),
        })
      ),
      status: z.string().optional(),
    })
  ),
});

// Default prompt for AI processing
const DEFAULT_READING_PROMPT = `
You are an expert in IELTS Academic Reading test preparation. Your task is to convert raw text from an IELTS Academic Reading test into a structured JSON format. The input text may contain multiple passages, each with questions, and possibly some instructions. Analyze the text and structure it into the following JSON schema:

{
  "title": string, // e.g., "IELTS Academic Reading Test 1"
  "type": string, // "academic" or "general"
  "status": string, // "draft" (optional)
  "passages": [
    {
      "passage_number": integer, // e.g., 1, 2, 3
      "title": string, // e.g., "The History of Flight"
      "body": string, // the passage text
      "section_instruction": string | null, // instructions for the section (optional)
      "status": string, // "draft" (optional)
      "questions": [
        {
          "question_number": integer, // e.g., 1, 2, 3
          "question_type": string, // One of: ${allowedReadingQuestionTypes.join(", ")}
          "question_text": string, // the question text (or "text")
          "instruction": string | null, // instructions for the question (optional)
          "options": string[] | null, // list of options if applicable
          "correct_answer": string | string[] | null, // correct answer(s) (or "answer")
          "status": string, // "draft" (optional)
        }
      ]
    }
  ]
}

- Assign appropriate question_type based on the context (e.g., "Matching Headings" if headings are listed).
- Do not include any explanatory text outside the JSON structure.
- Ensure all fields are populated where possible, leaving null or empty if data is missing.
- Use "draft" for all status fields unless specified.
`;

// Loading saved AI prompts from localStorage safely
function loadSavedPrompts() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem('savedPrompts');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
}

// Saving a new AI prompt to localStorage
function savePrompt(label: string, prompt: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    const prompts = loadSavedPrompts();
    prompts.push({ label, prompt });
    localStorage.setItem('savedPrompts', JSON.stringify(prompts));
  }
}

// Defining steps for the import process
const STEPS = [
  { label: "Upload", desc: "Upload your PDF, image, or text file" },
  { label: "Review/Edit", desc: "Review and edit extracted content" },
  { label: "Convert", desc: "Convert to JSON, CSV, and preview" },
  { label: "Submit", desc: "Upload to Supabase" },
];

// Main component for reading test importer
export default function ReadingImporterClient() {
  const [step, setStep] = useState(0);
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [editableJSON, setEditableJSON] = useState('');
  const [jsonErrors, setJsonErrors] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<GridRow[]>([]);
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastBatchIds, setLastBatchIds] = useState<string[]>([]);
  const [undoLoading, setUndoLoading] = useState(false);
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(DEFAULT_READING_PROMPT);
  const [customPromptLabel, setCustomPromptLabel] = useState('');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [showPromptSelector, setShowPromptSelector] = useState(false);
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setSavedPrompts(loadSavedPrompts());
  }, []);

  const debouncedParse = useRef(
    debounce((text: string) => {
      try {
        const json = parseIeltsReadingTextToJson(text);
        setEditableJSON(json);
        setJsonErrors([]);
      } catch (err: any) {
        setJsonErrors([err.message]);
        console.error('Parse error:', err);
      }
    }, 500)
  ).current;

  useEffect(() => {
    debouncedParse(text);
  }, [text, debouncedParse]);

  useEffect(() => {
    if (editableJSON) {
      try {
        const parsed = JSON.parse(editableJSON);
        setCsvRows(parseIeltsReadingTextToCsv(JSON.stringify(parsed)));
      } catch (err) {
        setCsvRows([]);
        console.error('CSV parse error:', err);
      }
    }
  }, [editableJSON]);

  const nextStep = () => setStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'application/json': ['.json'],
    },
    onDrop: async (acceptedFiles) => {
      setLoading(true);
      setIsUploaded(false);
      let combinedText = text;
      for (const file of acceptedFiles) {
        try {
          if (file.type === 'application/json') {
            const jsonText = await file.text();
            try {
              const parsed = JSON.parse(jsonText);
              setEditableJSON(JSON.stringify(parsed, null, 2));
              setJsonErrors([]);
              setFileName(file.name);
              setStep(2);
            } catch (err) {
              toast.error('❌ Invalid JSON file.');
              console.error('JSON parse error:', err);
            }
          } else if (file.type === 'application/pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const pageText = content.items.map((item: any) => ('str' in item ? item.str : '')).join(' ');
              combinedText += '\n\n' + `[Page ${i}]\n` + pageText;
            }
          } else {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/ocr-vision', { method: 'POST', body: formData });
            const { text: ocrText } = await res.json();
            combinedText += '\n\n' + `[Image OCR]\n` + ocrText;
          }
        } catch (err) {
          toast.error('❌ Failed to process file.');
          console.error('File processing error:', err);
        }
      }
      setText(combinedText.trim());
      setFileName(acceptedFiles[0]?.name || null);
      setLoading(false);
    },
  });

  const handleHelpFromAI = () => {
    console.log('Help from AI clicked');
    setShowPromptSelector(true);
  };

  const handlePromptSubmit = async () => {
    console.log('Submitting prompt');
    setShowPromptSelector(false);
    setAiOutput('');
    setAiLoading(true);
    const chosenPrompt = savedPrompts[selectedPromptIdx]?.prompt || DEFAULT_READING_PROMPT;
    try {
      let cachedOutput: string | null = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        cachedOutput = localStorage.getItem(`aiOutput_${text.slice(0, 50)}`);
      }
      if (cachedOutput) {
        setAiOutput(cachedOutput);
        setEditableJSON(cachedOutput);
        toast.success('✅ Loaded cached AI output!');
        setAiLoading(false);
        return;
      }
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: chosenPrompt, text }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log('AI response:', data);
      const output = data.output || data.text || (data.choices && data.choices[0] && (data.choices[0].message?.content || data.choices[0].text)) || '';
      if (!output || typeof output !== 'string' || !output.trim()) {
        throw new Error('AI response missing output.');
      }
      let cleanedOutput = output.replace(/^```(?:json)?\s*/, '').replace(/```$/g, '').trim();
      try {
        const parsed = JSON.parse(cleanedOutput);
        cleanedOutput = JSON.stringify(parsed, null, 2);
      } catch {
        // Fallback to raw output if parsing fails
      }
      setAiOutput(cleanedOutput);
      setEditableJSON(cleanedOutput);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`aiOutput_${text.slice(0, 50)}`, cleanedOutput);
      }
      toast.success('✅ AI-generated JSON ready!');
    } catch (err: any) {
      toast.error(`❌ AI generation failed: ${err.message}`);
      console.error('AI error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleConvertToJson = () => {
    console.log('Converting to JSON');
    setLoading(true);
    setShowValidationModal(false);
    try {
      const json = parseIeltsReadingTextToJson(text);
      setEditableJSON(json);
      setJsonErrors([]);
      toast.success('✅ Converted to JSON successfully!');
    } catch (err: any) {
      setJsonErrors([err.message]);
      toast.error('❌ Failed to convert to JSON.');
      console.error('JSON conversion error:', err);
    }
    setLoading(false);
  };

  const handleConvertToCsv = () => {
    console.log('Converting to CSV');
    setLoading(true);
    try {
      const parsed = JSON.parse(editableJSON);
      setCsvRows(parseIeltsReadingTextToCsv(JSON.stringify(parsed)));
      toast.success('✅ Converted to CSV successfully!');
    } catch (err) {
      setCsvRows([]);
      toast.error('❌ Failed to convert to CSV.');
      console.error('CSV conversion error:', err);
    }
    setLoading(false);
  };

  const handlePrettifyJSON = () => {
    console.log('Prettifying JSON');
    try {
      const parsed = JSON.parse(editableJSON);
      setEditableJSON(JSON.stringify(parsed, null, 2));
      setJsonErrors([]);
      toast.success('✅ JSON prettified and validated!');
    } catch (err: any) {
      setJsonErrors([err.message]);
      toast.error('❌ Invalid JSON format.');
      console.error('Prettify error:', err);
    }
  };

  const handleUploadJSON = async () => {
    setLoading(true);
    setProgress(0);
    setLastBatchIds([]);
    setValidationErrors([]);
    setShowValidationModal(false);
    let paperId: string | null = null;
    const user = (await supabase.auth.getUser()).data.user;
    try {
      let paper: ReadingPaper = JSON.parse(editableJSON);

      paper = {
        ...paper,
        passages: paper.passages.map(passage => ({
          ...passage,
          questions: passage.questions.map(question => ({
            ...question,
            question_type:
              question.question_type === "Matching Paragraph Information"
                ? "Matching Information"
                : question.question_type === "Short-Answer Questions"
                ? "Short-answer Questions"
                : question.question_type,
          })),
        })),
      };

      const { data: existingPaper, error: checkError } = await supabase
        .from('reading_papers')
        .select('id')
        .eq('title', paper.title)
        .single();
      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(`Failed to check for duplicates: ${checkError.message}`);
      }
      if (existingPaper) {
        setValidationErrors([`A paper with title "${paper.title}" already exists in the database.`]);
        setShowValidationModal(true);
        setLoading(false);
        return;
      }

      const errors = await validateReadingPaper(paper);
      setValidationErrors(errors);
      setShowValidationModal(true);
      if (errors.length > 0) {
        setLoading(false);
        return;
      }
      const paperInsert = {
        title: paper.title,
        type: paper.type,
        status: paper.status || "draft",
        created_by: user?.id || null,
        updated_by: user?.id || null,
      };
      const { data: insertedPaper, error: paperError } = await supabase
        .from('reading_papers')
        .insert(paperInsert)
        .select()
        .single();
      if (paperError) throw paperError;
      paperId = insertedPaper.id;
      setProgress(10);

      let allInsertedIds: string[] = [];
      let rowCount = 0;
      for (const passage of paper.passages || []) {
        const passageInsert = {
          paper_id: paperId,
          passage_number: passage.passage_number,
          title: passage.title,
          body: passage.body,
          section_instruction: passage.section_instruction || null,
          status: passage.status || "draft",
          created_by: user?.id || null,
          updated_by: user?.id || null,
        };
        const { data: passageRow, error: passageError } = await supabase
          .from('reading_passages')
          .insert(passageInsert)
          .select()
          .single();
        if (passageError) throw passageError;
        const passageId = passageRow.id;
        setProgress(20);

        for (const q of passage.questions || []) {
          const answer = typeof q.correct_answer === 'string' && q.correct_answer.startsWith('[')
            ? JSON.parse(q.correct_answer)
            : q.correct_answer || q.answer || null;
          const questionInsert = {
            paper_id: paperId,
            passage_id: passageId,
            question_number: q.question_number,
            question_type: q.question_type,
            text: q.question_text || q.text || "",
            instruction: q.instruction || null,
            answer,
            options: q.options || null,
            status: q.status || "draft",
            created_by: user?.id || null,
            updated_by: user?.id || null,
          };
          const { data, error } = await supabase
            .from('reading_questions')
            .insert(questionInsert)
            .select('id')
            .single();
          if (error) throw error;
          allInsertedIds.push(data.id);
          rowCount++;
          setProgress(20 + Math.floor(70 * rowCount / (paper.passages.length * passage.questions.length)));
        }
      }
      await supabase.from('reading_import_logs').insert({
        imported_at: new Date().toISOString() + 'Z',
        summary: {
          paper_title: paper.title,
          num_passages: paper.passages.length,
          num_questions: paper.passages.reduce((sum, p) => sum + p.questions.length, 0),
        },
        affected_paper_ids: [paperId],
        user_id: user?.id || null,
      });
      setLastBatchIds(allInsertedIds);
      setProgress(100);
      setSuccessMsg("✅ Upload successful! All passages and questions saved.");
      setIsUploaded(true);
      setText('');
      setFileName(null);
      setEditableJSON('');
      setCsvRows([]);
      setJsonErrors([]);
      setStep(1);
      toast.success('✅ Upload completed! Ready to review next file.');
    } catch (err: any) {
      setSuccessMsg(`❌ Upload failed: ${err.message}`);
      if (paperId) {
        await supabase.from('reading_papers').delete().eq('id', paperId);
      }
      console.error('Upload error:', err); // Log error for debugging
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  const handleUploadCSV = async () => {
    setLoading(true);
    setProgress(0);
    setLastBatchIds([]);
    setValidationErrors([]);
    setShowValidationModal(false);
    let paperId: string | null = null;
    const user = (await supabase.auth.getUser()).data.user;
    try {
      const errors = csvRows.map((row, idx) => {
        const errors: string[] = [];
        if (!row.question_text) errors.push(`Row ${idx + 1}: Missing question_text`);
        return errors;
      }).flat();
      setValidationErrors(errors);
      setShowValidationModal(true);
      if (errors.length > 0) {
        setLoading(false);
        return;
      }
      const paperInsert = {
        title: `CSV Import ${Date.now()}`,
        type: 'academic',
        status: "draft",
        created_by: user?.id || null,
        updated_by: user?.id || null,
      };
      const { data: insertedPaper, error: paperError } = await supabase
        .from('reading_papers')
        .insert(paperInsert)
        .select()
        .single();
      if (paperError) throw paperError;
      paperId = insertedPaper.id;
      setProgress(10);

      let allInsertedIds: string[] = [];
      let rowCount = 0;
      for (const row of csvRows) {
        const passageInsert = {
          paper_id: paperId,
          passage_number: row.passage_number,
          title: row.passage_title,
          body: null,
          status: "draft",
          created_by: user?.id || null,
          updated_by: user?.id || null,
        };
        const { data: passageRow, error: passageError } = await supabase
          .from('reading_passages')
          .insert(passageInsert)
          .select()
          .single();
        if (passageError) throw passageError;
        const passageId = passageRow.id;

        const questionInsert = {
          paper_id: paperId,
          passage_id: passageId,
          question_number: row.question_number,
          question_type: row.question_type === "Matching Information"
            ? "Matching Paragraph Information"
            : row.question_type === "Short-answer Questions"
            ? "Short-answer Questions"
            : row.question_type,
          text: row.question_text,
          options: row.options ? row.options.split(',').map(o => o.trim()) : null,
          answer: row.correct_answer || null,
          status: "draft",
          created_by: user?.id || null,
          updated_by: user?.id || null,
        };
        const { data, error } = await supabase
          .from('reading_questions')
          .insert(questionInsert)
          .select('id')
          .single();
        if (error) throw error;
        allInsertedIds.push(data.id);
        rowCount++;
        setProgress(10 + Math.floor(90 * rowCount / csvRows.length));
      }
      await supabase.from('reading_import_logs').insert({
        imported_at: new Date().toISOString() + 'Z',
        summary: {
          paper_title: paperInsert.title,
          num_passages: new Set(csvRows.map(row => row.passage_number)).size,
          num_questions: csvRows.length,
        },
        affected_paper_ids: [paperId],
        user_id: user?.id || null,
      });
      setLastBatchIds(allInsertedIds);
      setProgress(100);
      setSuccessMsg("✅ CSV upload successful!");
      setIsUploaded(true);
      setText('');
      setFileName(null);
      setEditableJSON('');
      setCsvRows([]);
      setStep(1);
      toast.success('✅ CSV upload completed! Ready to review next file.');
    } catch (err: any) {
      setSuccessMsg(`❌ CSV upload failed: ${err.message}`);
      if (paperId) {
        await supabase.from('reading_papers').delete().eq('id', paperId);
      }
      console.error('CSV upload error:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  const handleUndo = async () => {
    if (!lastBatchIds.length) return;
    setUndoLoading(true);
    try {
      const { error } = await supabase
        .from('reading_questions')
        .delete()
        .in('id', lastBatchIds);
      if (error) throw error;
      toast.success('✅ Undo successful!');
    } catch (err: any) {
      toast.error(`❌ Undo failed: ${err.message}`);
    } finally {
      setUndoLoading(false);
      setLastBatchIds([]);
      setIsUploaded(false);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([editableJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reading_test.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['passage_number', 'passage_title', 'question_number', 'question_text', 'question_type', 'options', 'correct_answer'];
    const csv = [
      headers.join(','),
      ...csvRows.map(row =>
        headers.map(header => `"${(row as any)[header] || ''}"`).join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reading_test.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteSelectedRows = () => {
    const selectedIds = csvRows.filter(row => row.isSelected).map(row => row.id);
    setCsvRows(prev => prev.filter(row => !selectedIds.includes(row.id)));
    setRowErrors(prev => {
      const newErrors = { ...prev };
      selectedIds.forEach(id => delete newErrors[prev.findIndex(r => r.id === id)]);
      return newErrors;
    });
  };

  return (
    <div className="p-2 sm:p-4 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'} />
      <AIWaitOverlay show={aiLoading} />

      <div className="flex flex-col md:flex-row items-center md:justify-between gap-2 mb-6">
        {STEPS.map((stepItem, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white
              ${step === i ? 'bg-indigo-600' : i < step ? 'bg-green-500' : 'bg-gray-300'}`}>
              {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-1 bg-gray-300 mx-1 md:mx-2 rounded"></div>
            )}
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-2">{STEPS[step].label}</h2>
      <p className="text-gray-600 mb-4">{STEPS[step].desc}</p>

      {step === 0 && (
        <div className="flex flex-col gap-4 items-center">
          <div
            {...getRootProps()}
            className={clsx(
              'w-full max-w-md flex flex-col items-center p-6 border-2 border-dashed border-indigo-400 rounded cursor-pointer transition hover:bg-indigo-50 focus-within:border-indigo-700',
              isDragActive && 'bg-indigo-50'
            )}
          >
            <input {...getInputProps()} aria-label="Upload PDF, image, or JSON" />
            <span className="text-2xl text-indigo-600 mb-2">⬆️</span>
            <span className="font-semibold">Drop your file here or click to browse</span>
            <span className="text-xs text-gray-500 mt-1">
              Accepts PDF, image, or JSON files.
            </span>
          </div>
          {fileName && (
            <div className="text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {fileName} uploaded.
            </div>
          )}
          <textarea
            className="w-full max-w-md h-32 p-2 border rounded"
            placeholder="Or paste reading test text or JSON here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            title="Paste your raw text or JSON content here for processing"
          />
          <Button
            onClick={nextStep}
            disabled={loading || (!text && !fileName)}
            className="mt-4 w-full max-w-xs"
          >
            Next: Review
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full h-40 p-2 border rounded"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Review and edit the extracted text or JSON…"
            title="Edit the extracted content before conversion"
          />
          <div className="flex justify-between gap-2">
            <Button onClick={prevStep} variant="secondary">
              Back
            </Button>
            <Button
              onClick={() => {
                handleConvertToJson();
                nextStep();
              }}
              disabled={loading || !text}
            >
              Next: Convert to CSV
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full h-40 p-2 border rounded font-mono"
            value={editableJSON}
            onChange={(e) => setEditableJSON(e.target.value)}
            placeholder="JSON preview. You can edit before final upload…"
            title="Review and edit the JSON output here"
          />
          <div className="text-xs text-gray-500">
            <button
              onClick={() => setEditableJSON(JSON.stringify(readingSchemaExample, null, 2))}
              className="underline text-indigo-500"
              title="Load an example JSON to test the format"
            >
              Load Example JSON
            </button>
          </div>
          <div className="flex justify-between gap-2">
            <Button onClick={prevStep} variant="secondary">
              Back
            </Button>
            <Button
              onClick={() => {
                handleConvertToCsv();
                nextStep();
              }}
              disabled={!editableJSON}
            >
              Next: Convert to CSV
            </Button>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold mb-2">⚙️ Controls</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleHelpFromAI} disabled={aiLoading} variant="primary" className="w-full mb-2">
                {aiLoading ? 'Generating…' : <><FiCheck /> Help from AI</>}
              </Button>
              <Button onClick={handlePrettifyJSON} disabled={loading} variant="secondary" className="w-full mb-2">
                <FiCheck /> Prettify & Validate JSON
              </Button>
              <Button onClick={() => setShowCustomPrompt(v => !v)} variant="secondary" className="w-full">
                {showCustomPrompt ? 'Hide' : 'Show'} AI Instructions
              </Button>
            </div>
            {showCustomPrompt && (
              <div className="mt-4">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full h-32 p-2 border rounded mb-2 resize-y dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="AI instructions for reading test conversion"
                />
                <input
                  value={customPromptLabel}
                  onChange={(e) => setCustomPromptLabel(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Prompt label (e.g., 'IELTS Reading Parser')"
                />
                <Button variant="success" onClick={() => { if (customPromptLabel && customPrompt) { savePrompt(customPromptLabel, customPrompt); setSavedPrompts(loadSavedPrompts()); toast.success('✅ Custom prompt saved!'); } else toast.error('❌ Enter a label and prompt.'); }}>
                  Save Prompt
                </Button>
              </div>
            )}
            {showPromptSelector && (
              <div className="mt-4">
                <select
                  value={selectedPromptIdx}
                  onChange={(e) => setSelectedPromptIdx(Number(e.target.value))}
                  className="w-full p-2 border rounded mb-2"
                >
                  {savedPrompts.map((p, i) => (
                    <option key={i} value={i}>{p.label}</option>
                  ))}
                  <option value={savedPrompts.length}>Default Prompt</option>
                </select>
                <Button onClick={handlePromptSubmit} disabled={aiLoading} variant="primary">
                  {aiLoading ? 'Generating…' : 'Submit Prompt'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 border rounded p-3 text-sm">
            Please review your JSON or CSV below. When ready, click "Upload" to submit to Supabase.<br />
            <span className="text-xs text-gray-500">You can go back to fix issues before uploading.</span>
          </div>
          <textarea
            className="w-full h-40 p-2 border rounded font-mono"
            value={editableJSON}
            onChange={(e) => setEditableJSON(e.target.value)}
          />
          {csvRows.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">CSV Preview</h4>
              <DataGrid
                columns={[
                  { key: 'passage_number', name: 'Passage #' },
                  { key: 'passage_title', name: 'Passage Title' },
                  { key: 'question_number', name: 'Question #' },
                  { key: 'question_text', name: 'Question Text' },
                  { key: 'question_type', name: 'Question Type' },
                  { key: 'options', name: 'Options' },
                  { key: 'correct_answer', name: 'Correct Answer' },
                  SelectColumn,
                ]}
                rows={csvRows}
                onRowsChange={setCsvRows}
              />
            </div>
          )}
          <div className="flex justify-between gap-2">
            <Button onClick={prevStep} variant="secondary">
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleUploadJSON}
                disabled={loading || isUploaded}
                variant="success"
              >
                Upload JSON
              </Button>
              <Button
                onClick={handleUploadCSV}
                disabled={loading || isUploaded || csvRows.length === 0}
                variant="success"
              >
                Upload CSV
              </Button>
            </div>
          </div>
          {showValidationModal && validationErrors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-2 rounded">
              <XCircle className="w-5 h-5 inline text-red-600 mr-1" />
              <span className="font-semibold text-red-700">Validation Errors:</span>
              <ul className="mt-1 list-disc list-inside text-red-700 text-sm">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-2">Please correct these fields and try again.</p>
            </div>
          )}
          {successMsg && (
            <div className={`p-3 mt-3 rounded border
              ${successMsg.startsWith("✅") ? "border-green-600 bg-green-50 text-green-800" : "border-red-600 bg-red-50 text-red-800"}`}>
              {successMsg}
            </div>
          )}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      )}

      {step > 1 && editableJSON && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-1 cursor-pointer" onClick={() => setShowPreview(!showPreview)}>
            <Info className="w-5 h-5 text-blue-400" /> Live Preview {showPreview ? <FiChevronUp /> : <FiChevronDown />}
          </h3>
          {showPreview && (
            <div className="bg-gray-100 rounded p-2">
              <ReadingPreview
                paper={(() => {
                  try {
                    return JSON.parse(editableJSON);
                  } catch {
                    return null;
                  }
                })()}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}