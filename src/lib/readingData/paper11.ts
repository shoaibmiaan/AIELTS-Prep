export const ieltsPastPapers = [
  {
    id: 'sample-academic-paper',
    title: 'IELTS Academic Reading – Sample Test',
    instructions: 'Read the following three passages carefully and answer the questions below each one.',
    timeLimit: 20,
    passages: [
      {
        id: 'passage-1',
        title: 'The Discovery of Penicillin',
        content: `In 1928, Alexander Fleming, a Scottish scientist, discovered penicillin purely by accident...`,
        questions: [
          {
            number: 1,
            type: 'multiple-choice',
            question: 'Who discovered penicillin?',
            options: [
              'A. Marie Curie',
              'B. Louis Pasteur',
              'C. Alexander Fleming',
              'D. Joseph Lister'
            ],
            answer: 'C',
            explanation: 'Fleming is credited with discovering penicillin in 1928.'
          },
          {
            number: 2,
            type: 'true-false-notgiven',
            question: 'Penicillin was first tested on humans in 1928.',
            options: ['True', 'False', 'Not Given'],
            answer: 'False',
            explanation: 'It wasn’t tested on humans until the early 1940s.'
          }
        ]
      },
      {
        id: 'passage-2',
        title: 'Renewable Energy Sources',
        content: `Renewable energy includes solar, wind, hydro, and geothermal energy. These sources are considered cleaner alternatives...`,
        questions: [
          {
            number: 3,
            type: 'multiple-choice',
            question: 'Which of the following is NOT a renewable energy source?',
            options: [
              'A. Wind',
              'B. Coal',
              'C. Solar',
              'D. Hydro'
            ],
            answer: 'B',
            explanation: 'Coal is a non-renewable fossil fuel.'
          },
          {
            number: 4,
            type: 'true-false-notgiven',
            question: 'Geothermal energy is produced by Earth’s internal heat.',
            options: ['True', 'False', 'Not Given'],
            answer: 'True',
            explanation: 'Geothermal energy comes from underground heat.'
          }
        ]
      },
      {
        id: 'passage-3',
        title: 'The Psychology of Color',
        content: `Colors can influence human perception and behavior. For instance, blue is often associated with calmness...`,
        questions: [
          {
            number: 5,
            type: 'multiple-choice',
            question: 'Which color is linked to calmness?',
            options: [
              'A. Red',
              'B. Yellow',
              'C. Blue',
              'D. Orange'
            ],
            answer: 'C',
            explanation: 'The passage states blue is associated with calmness.'
          },
          {
            number: 6,
            type: 'true-false-notgiven',
            question: 'Red increases appetite.',
            options: ['True', 'False', 'Not Given'],
            answer: 'Not Given',
            explanation: 'The passage doesn’t mention appetite.'
          }
        ]
      }
    ]
  }
];
