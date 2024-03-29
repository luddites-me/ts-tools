/* eslint-disable
  no-shadow,
*/
const envExtended = require('dotenv-extended');

/**
 * Structure representing env configuration
 * @public
 */
export interface EnvConfig {
  encoding?: string;
  silent?: boolean;
  path?: string;
  defaults?: string;
  schema?: string;
  errorOnMissing?: boolean;
  errorOnExtra?: boolean;
  errorOnRegex?: boolean;
  includeProcessEnv?: boolean;
  assignToProcessEnv?: boolean;
  overrideProcessEnv?: boolean;
}

/**
 * Defaults for env config
 * @public
 */
export const EnvConfigDefaults: EnvConfig = {
  encoding: 'utf8',
  silent: true,
  path: '.env',
  defaults: '.env.defaults',
  schema: '.env.schema',
  errorOnMissing: true,
  errorOnExtra: true,
  errorOnRegex: false,
  includeProcessEnv: true,
  assignToProcessEnv: true,
  overrideProcessEnv: false,
};

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * This will load the `.env` file onto the current process.
 *
 * @remarks
 * Missing properties will be loaded from `.env.defaults` if possible.
 * If no defaults exist and the properties are defined in `.env.schema`,
 * but are missing from `.env`, an error will be thrown with the missing
 * property name.
 * @public
 */
export const loadEnv = (config: EnvConfig = EnvConfigDefaults): any => {
  return envExtended.load(config);
};

/**
 * Definition of Environment Variables available in this project
 * @public
 */
export enum EnvVariables {
  DOCS_CREATE_README_INDEX = 'DOCS_CREATE_README_INDEX',
  DOCS_CREATE_TOC = 'DOCS_CREATE_TOC',
  IGNORE_JSON_FILES = 'IGNORE_JSON_FILES',
  IGNORE_MARKDOWN_FILES = 'IGNORE_MARKDOWN_FILES',
  IGNORE_PEER_DEPENDENCIES = 'IGNORE_PEER_DEPENDENCIES',
  NODE_ENV = 'NODE_ENV',
  SYNC_PEER_DEPENDENCIES = 'SYNC_PEER_DEPENDENCIES',
}
