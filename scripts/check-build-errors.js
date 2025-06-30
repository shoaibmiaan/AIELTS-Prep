const { exec } = require('child_process');
const fs = require('fs');

exec('npx next build', (err, stdout, stderr) => {
  const output = stdout + '\n' + stderr;

  // Grab error/warning lines (customize pattern if needed)
  const lines = output.split('\n').filter(line =>
    line.includes('Error:') ||
    line.includes('Warning:') ||
    line.includes('Parsing error')
  );

  let checklist = `# 🛠️ NEXT BUILD ERROR CHECKLIST\n\n`;

  if (lines.length === 0) {
    checklist += '✅ All errors/warnings resolved!\n';
  } else {
    checklist += `❌ ${lines.length} errors/warnings found\n\n`;
    lines.forEach((line, i) => {
      checklist += `${i + 1}. [ ] ${line.trim()}\n`;
    });
  }

  fs.writeFileSync('BUILD_FIX_CHECKLIST.md', checklist);
  console.log('BUILD_FIX_CHECKLIST.md updated!');
});

