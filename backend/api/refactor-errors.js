import fs from 'fs';
import path from 'path';

const servicesDir = path.join(process.cwd(), 'src', 'services');

function refactorFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // Replace throw { status: XXX, message: YYY };
    // or throw { message: YYY, status: XXX };
    const regex1 = /throw\s*{\s*status\s*:\s*(\d+)\s*,\s*message\s*:\s*(.+?)\s*};?/g;
    if (regex1.test(content)) {
        content = content.replace(regex1, "throw new AppError($2, $1);");
        modified = true;
    }

    const regex2 = /throw\s*{\s*message\s*:\s*(.+?)\s*,\s*status\s*:\s*(\d+)\s*};?/g;
    if (regex2.test(content)) {
        content = content.replace(regex2, "throw new AppError($1, $2);");
        modified = true;
    }

    if (modified) {
        if (!content.includes("from '../utils/errors.js'") && !content.includes('import { AppError }')) {
            content = "import { AppError } from '../utils/errors.js';\n" + content;
        }
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Refactored', path.basename(filePath));
    }
}

function run() {
    const files = fs.readdirSync(servicesDir).filter(f => f.endsWith('.js'));
    for (const file of files) {
        refactorFile(path.join(servicesDir, file));
    }
}

run();
