const fs = require('fs');
const path = require('path');

const countLines = (dir) => {
  let totalLines = 0;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      totalLines += countLines(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.ts')) { // Add more extensions if needed
      const lines = fs.readFileSync(filePath, 'utf-8').split('\n').length;
      totalLines += lines;
    }
  }

  return totalLines;
};

const projectDir = 'C:/Users/HomePC/Documents/zap-server';
console.log(`Total lines of code: ${countLines(projectDir)}`);
