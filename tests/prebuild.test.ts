import chalk from 'chalk';
import {TOKENS_DEV} from '../src/consts/tokensDev';
import {TOKENS as TOKENS_PROD} from '../src/consts/tokensProd';
import type {IToken} from '../src/interfaces/IToken';

type TokenSource = 'prod' | 'dev';

interface ValidationIssue {
  source: TokenSource;
  address: string;
  chainId: number;
  symbol: string;
  name: string;
  message: string;
}

function validateTokens(tokens: IToken[], source: TokenSource): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const t of tokens) {
    const context = {
      source,
      address: t.address,
      chainId: t.chainId,
      symbol: t.symbol,
      name: t.name
    } as const;

    // Rule 1: if type includes 'erc20' then decimals should be > 0
    if (typeof t.type === 'string' && t.type.toLowerCase().includes('erc20')) {
      if (typeof t.decimals !== 'number' || !(t.decimals > 0)) {
        issues.push({...context, message: `decimals must be > 0 for ERC20-like tokens, got: ${String(t.decimals)}`});
      }
    }

    // Rule 2: name, symbol, type, logoURI non-empty; companies and supportedRouterVersions length > 0
    if (!t.name || String(t.name).trim().length === 0) {
      issues.push({...context, message: 'name must be a non-empty string'});
    }
    if (!t.symbol || String(t.symbol).trim().length === 0) {
      issues.push({...context, message: 'symbol must be a non-empty string'});
    }
    if (!t.type || String(t.type).trim().length === 0) {
      issues.push({...context, message: 'type must be a non-empty string'});
    }
    if (!t.logoURI || String(t.logoURI).trim().length === 0) {
      issues.push({...context, message: 'logoURI must be a non-empty string'});
    }
    if (!Array.isArray(t.companies) || t.companies.length === 0) {
      issues.push({...context, message: 'companies must be a non-empty array'});
    }
    if (!Array.isArray(t.supportedRouterVersions) || t.supportedRouterVersions.length === 0) {
      issues.push({...context, message: 'supportedRouterVersions must be a non-empty array'});
    }

    // Rule 3: chainId should be > 0
    if (typeof t.chainId !== 'number' || !(t.chainId > 0)) {
      issues.push({...context, message: `chainId must be > 0, got: ${String(t.chainId)}`});
    }
  }

  return issues;
}

function formatIssue(issue: ValidationIssue): string {
  const header = chalk.gray(`[${issue.source}]`) + ' ' + chalk.cyan(`${issue.name} (${issue.symbol})`);
  const tail = chalk.gray(`chainId=${issue.chainId} address=${issue.address}`);
  return `${header} ${chalk.red('—')} ${issue.message} ${tail}`;
}

async function main() {
  const allIssues: ValidationIssue[] = [];

  allIssues.push(...validateTokens(TOKENS_DEV as IToken[], 'dev'));
  allIssues.push(...validateTokens(TOKENS_PROD as IToken[], 'prod'));

  if (allIssues.length > 0) {
    console.error(chalk.bgRed.white.bold(' Pre-build validation failed '));
    for (const issue of allIssues) {
      console.error(' - ' + formatIssue(issue));
    }
    console.error(chalk.red(`Total issues: ${allIssues.length}`));
    process.exit(1);
  } else {
    console.log(chalk.bgGreen.black(' Pre-build validation passed '));
  }
}

main().catch((err) => {
  console.error(chalk.bgRed.white(' Pre-build validator crashed '));
  console.error(err);
  process.exit(1);
});
