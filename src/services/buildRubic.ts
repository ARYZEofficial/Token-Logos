import * as path from 'path';
import {OUTPUT_DIR, TOKEN_LIST_FILE_NAME_RUBIC} from '../consts/exportNames';
import {TOKENS_FOR_RUBIC} from '../consts/rubicAryzeTokens';
import {write} from './build';

export async function build() {
  try {
    const __dirname = path.resolve();

    const data = TOKENS_FOR_RUBIC.sort((a, b) => a.network_title.localeCompare(b.network_title));

    const filePath = path.join(__dirname, OUTPUT_DIR, TOKEN_LIST_FILE_NAME_RUBIC);

    write(filePath, data);
    console.log(`Saved ${data.length} tokens`);
  } catch (error) {
    console.log(error);
  }
}

build();
