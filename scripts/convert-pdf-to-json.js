/**
 * scripts/convert-pdf-to-json.js
 */
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

async function loadPdfText(pdfPath) {
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdf(buffer);
  return data.text;             // all the text, with newlines
}

// ———— your custom regex helpers ————

/**
 * 1) Split the whole text into per-test chunks
 *    e.g. each “Test 1: …” up to the next “Test 2:” or EOF
 */
function splitIntoTests(rawText) {
  return Array.from(
    rawText.matchAll(/(Test\s+\d+:[\s\S]*?)(?=Test\s+\d+:|$)/g),
    m => m[1].trim()
  );
}

/**
 * 2) Within one test-chunk, split into its four SECTION blocks
 */
function splitIntoSections(testText) {
  return Array.from(
    testText.matchAll(/(SECTION\s+\d+[\s\S]*?)(?=SECTION\s+\d+|$)/g),
    m => m[1].trim()
  );
}

/**
 * 3) Turn one section-block into { section, questions: [...] }
 *    You’ll need two flavors of regex:
 *    – fill-blank: lines like “1   Company name: ____ Hotel Chains”
 *    – mcq:      lines like “11. What’s X? A. …  B. …  C. …  D. …”
 */
function parseQuestionsFromSection(sectionText) {
  // First grab the section number:
  const secMatch = sectionText.match(/SECTION\s+(\d+)/i);
  const sectionNum = secMatch ? Number(secMatch[1]) : null;

  const questions = [];

  // 3a) fill-blank questions
  for (const m of sectionText.matchAll(/^(\d+)\s+(.+?_{2,}.*?)$/gm)) {
    questions.push({
      id: `q${m[1]}`,
      type: 'fill-blank',
      prompt: m[2].replace(/_{2,}/g, '____'),
      // you’ll fill correctAnswer later (either by parsing its answer key or by hand)
    });
  }

  // 3b) MCQs
  for (const m of sectionText.matchAll(
    /^(\d+)\.\s+(.+?)\nA\.\s*(.+?)\nB\.\s*(.+?)\nC\.\s*(.+?)\nD\.\s*(.+?)(?=\n\d+\.|\n$)/gms
  )) {
    questions.push({
      id: `q${m[1]}`,
      type: 'mcq',
      prompt: m[2].trim(),
      options: [ 'A. ' + m[3], 'B. ' + m[4], 'C. ' + m[5], 'D. ' + m[6] ],
      // correctAnswer: fill this in later
    });
  }

  return { section: sectionNum, questions };
}

async function main() {
  const pdfPath = path.resolve(process.cwd(), 'src', 'data', 'listening-tests.pdf');
  const rawText = await loadPdfText(pdfPath);

  const tests = splitIntoTests(rawText).map((testBlock, idx) => {
    // optional: extract the test title from the top line
    const titleLine = testBlock.split('\n', 1)[0].trim();
    const sections = splitIntoSections(testBlock).map(parseQuestionsFromSection);
    return {
      title: titleLine,
      audioPath: `./src/audio/test${idx+1}.mp3`,  // assume you named them test1.mp3…test100.mp3
      sections
    };
  });

  // Write out your JSON
  fs.writeFileSync(
    path.resolve(process.cwd(), 'src', 'data', 'all-listening-tests.json'),
    JSON.stringify(tests, null, 2),
    'utf-8'
  );

  console.log(`✅ Converted ${tests.length} tests to JSON!`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
