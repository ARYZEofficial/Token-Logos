import chalk from 'chalk';
import * as fs from 'fs/promises'; // Use promises for cleaner async/await syntax
import * as path from 'path';
import {format} from 'prettier';

export async function updateParams(env: 'DEV' | 'PROD') {
  try {
    const __dirname = path.resolve();
    let filePath;
    if (env == 'DEV') {
      filePath = path.join(__dirname, 'src/consts', 'jsonParamsDev.ts');
    }
    if (env == 'PROD') {
      filePath = path.join(__dirname, 'src/consts', 'jsonParamsProd.ts');
    }
    await updateVersion(filePath);
  } catch (error) {
    console.log(chalk.red(error.message));
  }
}

async function updateVersion(filePath: string): Promise<void> {
  try {
    // Read the file content
    const fileData = await fs.readFile(filePath, 'utf-8');

    const versionRegex = /version: {major: (\d+), minor: (\d+), patch: (\d+)},\s+/;
    const timestampRegex = /timestamp: '([^']+)'/;

    const versionMatches = versionRegex.exec(fileData);
    const timestampMatches = timestampRegex.exec(fileData);

    if (!versionMatches) throw new Error(`Could not find version information in ${filePath}`);

    if (!timestampMatches) throw new Error(`Could not find timestamp information in ${filePath}`);

    const [, major, minor, patch] = versionMatches;
    const [, oldTimestamp] = timestampMatches;

    // Increment patch version and get current timestamp
    const newPatch = Number(patch) + 1;
    const currentTimestamp = new Date().toISOString();

    // Update the version and timestamp strings
    const newVersionString = `version: {major: ${major}, minor: ${minor}, patch: ${newPatch}},\n`;
    const newTimestampString = `timestamp: '${currentTimestamp}'\n`;

    // Replace the old version and timestamp with the new ones
    const updatedFileData = fileData
      .replace(versionRegex, newVersionString)
      .replace(timestampRegex, newTimestampString);
    // Beautify the output using a formatter (e.g., prettier)
    const formattedFileData = await format(updatedFileData, {
      parser: 'typescript',
      printWidth: 80,
      tabWidth: 2,
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
      arrowParens: 'always',
      endOfLine: 'lf',
      bracketSpacing: false
    });

    // Write the formatted content back to the file
    await fs.writeFile(filePath, formattedFileData, 'utf-8');
    console.log(`Successfully updated version and timestamp in ${filePath}`);
  } catch (error) {
    console.error(`Error updating version and timestamp: ${error.message}`);
  }
}
