/* istanbul ignore file */

import { Options, format } from 'prettier';
import glob from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import { LogLevel, LogOutput, getLogger } from '../logger';
import { GLOB_OPTIONS, GlobOptions, globCallback } from '../env/files';

const prettierConfig: Options = {
  parser: 'markdown',
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  arrowParens: 'always',
  useTabs: false,
};

/**
 * Formats markdown content according to the prettier config
 * @public
 */
export const prettyMarkdown = (input: string): string => {
  return format(input, prettierConfig);
};

const log = getLogger(
  {
    logLevel: LogLevel.INFO,
    serviceName: 'js-tools/sort-json',
    transports: [LogOutput.CONSOLE],
  },
  true,
);

// Prettier all the source code
const defaultPath = '**/*.ts';

/* eslint-disable-next-line complexity, sonarjs/cognitive-complexity */
const defaultCallback = (er: Error | null, files: string[]): void => {
  if (er) {
    log.error(er.toString());
  }
  files.forEach((fileName) => {
    try {
      const file = readFileSync(fileName, 'utf-8');
      const pretty = format(file, prettierConfig);
      writeFileSync(fileName, pretty);
    } catch (err) {
      log.error(`Error: parsing ${fileName}. Message: ${err.message}`);
    }
  });
};

/**
 * Runs format against a directory
 * @public
 */
export const pritify = (
  path: string = defaultPath,
  options: GlobOptions = GLOB_OPTIONS,
  callback: globCallback = defaultCallback,
): void => {
  glob(path, options, callback);
};

if (__filename === process?.mainModule?.filename) {
  pritify();
}