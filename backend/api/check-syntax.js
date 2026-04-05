import fs from 'fs/promises';
import { pathToFileURL } from 'url';
import path from 'path';

async function checkFiles() {
    const servicesDir = path.join(process.cwd(), 'src', 'services');
    const files = await fs.readdir(servicesDir);
    
    for (const file of files) {
        if (!file.endsWith('.js')) continue;
        const filePath = path.join(servicesDir, file);
        try {
            await import(pathToFileURL(filePath).href);
        } catch (e) {
            console.error(`Syntax Error in ${file}:`, e.message);
        }
    }
}

checkFiles().catch(console.error);
