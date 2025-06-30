// /src/utils/fullTestExample.ts

import { ReadingQuestionType } from "./readingQuestionTypes";

export const fullTestExample = {
  paper_id: "sample-ielts-academic-001",
  type: "academic",
  title: "IELTS Academic Reading Test Sample",
  instructions: "You should spend about 60 minutes on this test.",
  passages: [
    {
      passage_number: 1,
      title: "Save the Turtles",
      body: `A. Turtles have survived for millions of years, but in recent decades their populations have declined dramatically.
B. One major cause is the proliferation of plastic debris in oceans.
C. Many turtles mistake plastic bags for jellyfish, leading to fatal consequences.
D. Conservation groups have implemented measures to reduce plastic waste and protect nesting beaches.
E. Public education campaigns are beginning to show positive results.`,
      section_instruction: "You should spend about 20 minutes on Questions 1–13 which are based on Passage 1 below.",
      question_groups: [
        {
          group_instruction: "Questions 1–4: Which paragraph contains the following information?",
          question_type: ReadingQuestionType.MatchingInformation,
          questions: [
            { number: 1, text: "A description of a threat to turtles.", options: ["A", "B", "C", "D", "E"], answer: "B" },
            { number: 2, text: "A mention of human intervention to aid turtles.", options: ["A", "B", "C", "D", "E"], answer: "D" },
            { number: 3, text: "A reference to how turtles mistake plastic for food.", options: ["A", "B", "C", "D", "E"], answer: "C" },
            { number: 4, text: "Evidence that protection strategies are working.", options: ["A", "B", "C", "D", "E"], answer: "E" }
          ]
        },
        {
          group_instruction: "Questions 5–7: Do the following statements agree with the information given in Passage 1?",
          question_type: ReadingQuestionType.IdentifyingInformationTFNG,
          questions: [
            { number: 5, text: "Turtles have recently increased in number.", options: ["True", "False", "Not Given"], answer: "False" },
            { number: 6, text: "Some turtles eat plastic by mistake.", options: ["True", "False", "Not Given"], answer: "True" },
            { number: 7, text: "Conservation groups are not involved in turtle protection.", options: ["True", "False", "Not Given"], answer: "False" }
          ]
        },
        {
          group_instruction: "Questions 8–10: Choose the correct letter, A, B, C or D.",
          question_type: ReadingQuestionType.MultipleChoice,
          questions: [
            {
              number: 8,
              text: "What is the main threat to turtles described in the passage?",
              options: [
                "A. Overfishing",
                "B. Plastic pollution",
                "C. Climate change",
                "D. Habitat loss"
              ],
              answer: "B. Plastic pollution"
            },
            {
              number: 9,
              text: "What measure has helped to protect turtles?",
              options: [
                "A. Banning fishing",
                "B. Public education",
                "C. Building dams",
                "D. Beach development"
              ],
              answer: "B. Public education"
            }
          ]
        }
      ]
    },

    {
      passage_number: 2,
      title: "Timekeepers: The Invention of the Marine Chronometer",
      body: `A. Determining longitude at sea was a significant challenge for sailors.
B. Many attempts were made to solve the 'longitude problem', with little success for centuries.
C. John Harrison, a self-educated English carpenter, finally created an accurate marine chronometer in the 18th century.
D. The British government offered a prize for anyone who could solve the problem.
E. Harrison's invention revolutionised navigation and saved countless lives at sea.`,
      section_instruction: "You should spend about 20 minutes on Questions 14–26 which are based on Passage 2 below.",
      question_groups: [
        {
          group_instruction: "Questions 14–17: Match each statement with the correct paragraph, A–E.",
          question_type: ReadingQuestionType.MatchingInformation,
          questions: [
            { number: 14, text: "The offer of a reward for a solution.", options: ["A", "B", "C", "D", "E"], answer: "D" },
            { number: 15, text: "The person who invented a solution.", options: ["A", "B", "C", "D", "E"], answer: "C" },
            { number: 16, text: "The importance of the problem for sailors.", options: ["A", "B", "C", "D", "E"], answer: "A" },
            { number: 17, text: "Impact of the solution on sea travel.", options: ["A", "B", "C", "D", "E"], answer: "E" }
          ]
        },
        {
          group_instruction: "Questions 18–21: Complete the sentences below.",
          question_type: ReadingQuestionType.SentenceCompletion,
          questions: [
            { number: 18, text: "John Harrison was originally a _______.", options: [], answer: "carpenter" },
            { number: 19, text: "The marine chronometer allowed sailors to determine _______ at sea.", options: [], answer: "longitude" }
          ]
        },
        {
          group_instruction: "Questions 22–24: Choose the correct letter, A, B, C or D.",
          question_type: ReadingQuestionType.MultipleChoice,
          questions: [
            {
              number: 22,
              text: "Why was the invention of the marine chronometer significant?",
              options: [
                "A. It improved ship design.",
                "B. It solved a major navigational problem.",
                "C. It reduced shipping costs.",
                "D. It made maps obsolete."
              ],
              answer: "B. It solved a major navigational problem."
            },
            {
              number: 23,
              text: "What did the British government do to encourage innovation?",
              options: [
                "A. Built new ships",
                "B. Offered a prize",
                "C. Established schools",
                "D. Published a book"
              ],
              answer: "B. Offered a prize"
            }
          ]
        }
      ]
    },

    {
      passage_number: 3,
      title: "Education for All: The Finnish Model",
      body: `A. Finland's education system is widely regarded as one of the best in the world.
B. All students, regardless of background, have access to high-quality education.
C. Teachers are highly respected and must complete a master's degree to qualify.
D. Standardised testing is minimal, with a focus on holistic learning.
E. Finnish students consistently perform well in international assessments.`,
      section_instruction: "You should spend about 20 minutes on Questions 27–40 which are based on Passage 3 below.",
      question_groups: [
        {
          group_instruction: "Questions 27–30: Which paragraph contains the following information?",
          question_type: ReadingQuestionType.MatchingInformation,
          questions: [
            { number: 27, text: "A reference to international rankings.", options: ["A", "B", "C", "D", "E"], answer: "E" },
            { number: 28, text: "A description of teacher qualifications.", options: ["A", "B", "C", "D", "E"], answer: "C" }
          ]
        },
        {
          group_instruction: "Questions 31–34: Complete the table below.",
          question_type: ReadingQuestionType.TableCompletion,
          questions: [
            { number: 31, text: "Length of teacher training", options: [], answer: "5 years" },
            { number: 32, text: "Minimum qualification for teachers", options: [], answer: "master's degree" },
            { number: 33, text: "Focus of the curriculum", options: [], answer: "holistic learning" },
            { number: 34, text: "Frequency of standardised tests", options: [], answer: "minimal" }
          ]
        },
        {
          group_instruction: "Questions 35–38: Answer the questions below using NO MORE THAN THREE WORDS.",
          question_type: ReadingQuestionType.ShortAnswer,
          questions: [
            { number: 35, text: "What is the main goal of Finnish education?", options: [], answer: "equal opportunity" },
            { number: 36, text: "What must all teachers obtain before working?", options: [], answer: "master's degree" }
          ]
        },
        {
          group_instruction: "Questions 39–40: Do the following statements agree with the information given in Passage 3?",
          question_type: ReadingQuestionType.IdentifyingInformationTFNG,
          questions: [
            { number: 39, text: "All Finnish students pay tuition fees.", options: ["True", "False", "Not Given"], answer: "False" },
            { number: 40, text: "Standardised testing is common in Finland.", options: ["True", "False", "Not Given"], answer: "False" }
          ]
        }
      ]
    }
  ]
};
