import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import {OUTPUT_DIR, TOKEN_LIST_FILE_NAME, TOKEN_LIST_FILE_NAME_DEV} from '../consts/exportNames';
import {JSON_DEV_PARAMS} from '../consts/jsonParamsDev';
import {JSON_PROD_PARAMS} from '../consts/jsonParamsProd';
import {TOKENS_DEV} from '../consts/tokensDev';
import {TOKENS} from '../consts/tokensProd';
import {IJson} from '../interfaces/IJson';
import {updateParams as updateParamsVersion} from './updateParams';

export async function build(env: 'DEV' | 'PROD') {
  try {
    updateParamsVersion(env);
    const __dirname = path.resolve();
    let filePath, data: IJson;
    if (env == 'DEV') {
      data = JSON_DEV_PARAMS;
      data.tokens = TOKENS_DEV.sort((a, b) => a.symbol.localeCompare(b.symbol)).sort((a, b) => a.chainId - b.chainId);
      filePath = path.join(__dirname, OUTPUT_DIR, TOKEN_LIST_FILE_NAME_DEV);
    } else {
      data = JSON_PROD_PARAMS;
      data.tokens = TOKENS.sort((a, b) => a.symbol.localeCompare(b.symbol)).sort((a, b) => a.chainId - b.chainId);
      filePath = path.join(__dirname, OUTPUT_DIR, TOKEN_LIST_FILE_NAME);
    }
    write(filePath, data);
    console.log(`Saved ${data.tokens.length} tokens`);
  } catch (error) {
    console.log(error);
  }
}

export function write(filePath: string, data: object) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), {flag: 'wx'});
    console.log(chalk.bgGreenBright('File created successfully:', filePath));
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log(chalk.bgGreenBright('File already exists, overwriting:', filePath));
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), {flag: 'w'});
    } else {
      console.log(chalk.bgGreenBright('Error writing file:', error));
    }
  }
}
