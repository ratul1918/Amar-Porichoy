import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        let stat = fs.statSync(file); 
        if (stat && stat.isDirectory()) {
            if (!file.includes('supabase/functions')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
let count = 0;

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = content.replace(/@[0-9]+\.[0-9]+\.[0-9]+(?:-[a-zA-Z0-9.]+)?/g, '');
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        count++;
    }
}
console.log(`Fixed ${count} files`);
