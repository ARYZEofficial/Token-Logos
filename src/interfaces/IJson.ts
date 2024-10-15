import {IToken} from './IToken';

export interface IJson {
  name: string;
  timestamp: string;
  version: {major: number; minor: number; patch: number};
  tags: any;
  logoURI: string;
  keywords: string[];
  tokens: IToken[];
}
