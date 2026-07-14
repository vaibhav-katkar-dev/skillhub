const fs = require('fs');

const path = 'h:\\SkillHub\\frontend\\public\\data\\job-simulations.json';
let content = fs.readFileSync(path, 'utf8');

// Replace " Intern" with ""
content = content.replace(/"role": "(.*?) Intern(.*)"/g, '"role": "$1$2"');
// Fallback if regex didn't catch it correctly:
content = content.replace(/ Intern/g, '');

fs.writeFileSync(path, content);
console.log('Done removing Intern!');
