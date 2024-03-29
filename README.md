# ts-tools

## Table of Contents

- [ts-tools](#ts-tools)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [`package.json` scripts](#packagejson-scripts)
  - [Environment Variables](#environment-variables)
  - [License](#license)

## Getting Started

To get started, take a look at the documentation listed below:

- docs
  - [Project Bundling](docs/bundling.md)
  - [Documentation Tooling](docs/documentation.md)
  - [Environment Variables](docs/environment-variables.md)
  - [Logging Client](docs/logger.md)
  - [API Report File for "@luddites-me/ts-tools"](docs/project-api.md)
  - [Readme Tool](docs/readme.md)

## `package.json` scripts

- `yarn beautify`: Performs aesthetic operations to make the project files easier to navigate and read.
- `yarn build`: Assembles build scripts into a single js module with type definitions.
- `yarn build:prod`: Assembles the project for production.
- `yarn build:watch`: Builds and tests concurrently while you develop.
- `yarn clean`: Purges all temporary folders.
- `yarn count`: Counts lines of source code.
- `yarn docs:all`: Runs all documentation commands.
- `yarn docs:api`: Generates a single API doc based on the code in the project.
- `yarn docs:publish`: Assembles the Markdown documentation for the entire project and publish it to GitHub pages using API Extractor.
- `yarn docs:standardize`: Creates or updates a new readme with a standard set of readme sections, including a toc, yarn script documentation, links to repo documentation files and "The Unlicense" license.
- `yarn generate:exports`: Generates index.ts files for all exports recursively in the 'src' folder.
- `yarn lint`: Lints the codebase.
- `yarn lint:docs`: Lints the code documentation.
- `yarn lint:fix`: Lints the codebase and automatically fixes what it can.
- `yarn test`: Runs tests and calculates test coverage.
- `yarn test:bdd`: Runs the cucumber BDD test suite
- `yarn test:fast`: Runs tests in parallel and calculates test coverage.
- `yarn test:mutations`: Runs Stryker-Mutator across the unit test suite.
- `yarn test:watch`: Re-runs tests as you develop.

## Environment Variables

- `DOCS_CREATE_README_INDEX`: If true, create an index of all documents in README.md
  - Default Value: "true"
- `DOCS_CREATE_TOC`: If true, create a Table of Contents for each Markdown doc.
  - Default Value: "true"
- `IGNORE_JSON_FILES`: A comma-delimited list of json files to exclude from processing
  - Default Value: ".yarn,.vscode,.github,.tmp,temp,node_modules,.git"
- `IGNORE_MARKDOWN_FILES`: A comma-delimited list of markdown files to exclude from processing
  - Default Value: "protect-api.md,pull_request_template.md,.github,temp,.tmp,node_modules"
- `IGNORE_PEER_DEPENDENCIES`: Comma-delimited list of `dependencies` to exclude from `peerDependencies`.
  - Default Value: ""
- `NODE_ENV`: The runtime environment, either `prod` or `dev`.
  - Default Value: "dev"
- `SYNC_PEER_DEPENDENCIES`: If true, sets all project dependencies as peer dependencies
  - Default Value: "true"

## License

See [License](./LICENSE)
!© [CRF](https://blog.luddites.me)
