// src/utils/readingQuestionTypes.ts

// All allowed question types in IELTS Reading (official, comprehensive)
export const allowedReadingQuestionTypes = [
  "Matching Headings",
  "Matching Information",
  "Matching Features",
  "Matching Sentence Endings",
  "Identifying Information (True/False/Not Given)",     // True/False/Not Given
  "Identifying Writer's Views/Claims (Yes/No/Not Given)", // Yes/No/Not Given
  "Multiple Choice",
  "List of Options",
  "Choose a Title",
  "Short-answer Questions",
  "Sentence Completion",
  "Summary Completion",
  "Table Completion",
  "Flow-Chart Completion",
  "Diagram Label Completion",
] as const;

export type ReadingQuestionType = typeof allowedReadingQuestionTypes[number];

// For UI: what control to render for each type, and required fields
export interface ReadingQuestionTypeInfo {
  displayName: string;
  ui: "mcq" | "dropdown" | "input" | "matching" | "blank" | "options" | "title";
  requiredFields: ("question_text" | "options" | "correct_answer" | "instruction")[];
  // Optionally, supply student-facing instructions or example config
  studentInstructions?: string;
  answerChoices?: string[];
}

// Core mapping for all IELTS Reading question types
export const readingQuestionTypeMap: Record<ReadingQuestionType, ReadingQuestionTypeInfo> = {
  "Matching Headings": {
    displayName: "Matching Headings",
    ui: "matching",
    requiredFields: ["question_text", "options", "correct_answer"],
    studentInstructions: "Match each paragraph to the correct heading. Options list is provided.",
  },
  "Matching Information": {
    displayName: "Matching Information",
    ui: "matching",
    requiredFields: ["question_text", "options", "correct_answer"],
    studentInstructions: "Identify which paragraph contains the given information.",
  },
  "Matching Features": {
    displayName: "Matching Features",
    ui: "matching",
    requiredFields: ["question_text", "options", "correct_answer"],
    studentInstructions: "Match features (e.g., names, objects) to statements. Options list provided.",
  },
  "Matching Sentence Endings": {
    displayName: "Matching Sentence Endings",
    ui: "matching",
    requiredFields: ["question_text", "options", "correct_answer"],
    studentInstructions: "Complete each sentence by choosing the correct ending from the list.",
  },
  "Identifying Information (True/False/Not Given)": {
    displayName: "True/False/Not Given",
    ui: "dropdown",
    requiredFields: ["question_text", "correct_answer"],
    studentInstructions: "Select True, False, or Not Given for each statement.",
    answerChoices: ["True", "False", "Not Given"],
  },
  "Identifying Writer's Views/Claims (Yes/No/Not Given)": {
    displayName: "Yes/No/Not Given",
    ui: "dropdown",
    requiredFields: ["question_text", "correct_answer"],
    studentInstructions: "Select Yes, No, or Not Given for each statement.",
    answerChoices: ["Yes", "No", "Not Given"],
  },
  "Multiple Choice": {
    displayName: "Multiple Choice",
    ui: "mcq",
    requiredFields: ["question_text", "options", "correct_answer"],
    studentInstructions: "Choose the correct answer from the options.",
  },
  "List of Options": {
    displayName: "List of Options",
    ui: "options",
    requiredFields: ["question_text", "options", "correct_answer"],
    studentInstructions: "Choose one or more correct options (e.g., 'Select THREE').",
  },
  "Choose a Title": {
    displayName: "Choose a Title",
    ui: "title",
    requiredFields: ["question_text", "options", "correct_answer"],
    studentInstructions: "Choose the most appropriate title for the passage.",
  },
  "Short-answer Questions": {
    displayName: "Short Answer",
    ui: "input",
    requiredFields: ["question_text", "correct_answer"],
    studentInstructions: "Write a short answer. Usually limited to a number of words.",
  },
  "Sentence Completion": {
    displayName: "Sentence Completion",
    ui: "blank",
    requiredFields: ["question_text", "correct_answer"],
    studentInstructions: "Fill in the blank(s) to complete the sentence.",
  },
  "Summary Completion": {
    displayName: "Summary Completion",
    ui: "blank",
    requiredFields: ["question_text", "correct_answer"],
    studentInstructions: "Complete the summary using words from the passage.",
  },
  "Table Completion": {
    displayName: "Table Completion",
    ui: "blank",
    requiredFields: ["question_text", "correct_answer"],
    studentInstructions: "Fill in the blanks in the table with correct information.",
  },
  "Flow-Chart Completion": {
    displayName: "Flow-Chart Completion",
    ui: "blank",
    requiredFields: ["question_text", "correct_answer"],
    studentInstructions: "Fill in the blanks in the flow-chart.",
  },
  "Diagram Label Completion": {
    displayName: "Diagram Label Completion",
    ui: "blank",
    requiredFields: ["question_text", "correct_answer"],
    studentInstructions: "Label the diagram by filling in the missing words.",
  },
};

export function getQuestionTypeInfo(type: string): ReadingQuestionTypeInfo | undefined {
  // Helper to get full config/info for a given type
  return readingQuestionTypeMap[type as ReadingQuestionType];
}
