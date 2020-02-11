import { promisify } from 'util';
import { readFile, writeFile } from 'fs';
import { isAbsolute, join, resolve } from 'path';
import { 
  Block,
  BlockContent,
  Code,
  Content,
  IndexedBlocks,
  Query
} from './types'; 

export default class Readme {

  private static isHeader = (line: string) => /^ *#+ /.test(line);
  private static isCodeStartTag = (line: string) => /^ *```[^`]*$/.test(line);
  private static isCodeEndTag = (line: string) => /^ *``` *$/.test(line);
  private static isRootNode = (block: Block) => block.type === 'content' && block.header === '_root'; 
  private static isContentBlock = (block: Block) => block.type === 'content'; 
  private static sanitize = (line:string): string => line.replace(/ /g,'-').replace(/[^a-zA-Z0-9-]/g,''); // asci-centric
  private static repeat = (s: string, count: number): string => [...Array(count).keys()].map(_ => s).join('');
  private static makeLink = (text: string) => `[${Readme.sanitize(text)}](#${Readme.sanitize(text).toLowerCase()})`;

  path: string;
  blocks: Block[] = [];
  indexedBlocks: IndexedBlocks = new Map([]);

  constructor(path: string) {

    if (path.trim().length === 0) {
      throw new Error(`invalid path: ${path}`);
    }

    this.path = resolve(path);

  }

  async getReadme() {

    let content: string = '';

    try {

      content = await promisify(readFile)(this.path, { encoding: 'utf8' });

    } catch(e) {

      if (e.code === 'ENOENT') {
        console.log(`The file ${this.path} could not be read.`);
        process.exit(1);
      }

    }

    return content;

  }

  async parse():Promise<Readme> {

    const content = await this.getReadme();
    const lines = content.split('\n');

    const rootBlock: Content = {
      type: 'content',
      header: '_root',
      content: []
    };
    this.blocks.push(rootBlock);
    let currentHeaderKey = rootBlock.header;
    let inCodeBlock = false;

    // basic state machine to detect, line-by-line, which part of the readme
    for (const line of lines) {

      // transition into code section
      if (!inCodeBlock && Readme.isCodeStartTag(line)) {

        inCodeBlock = true;

        const newBlock: Code = {
          type: 'code',
          content: [line]
        };
        this.blocks.push(newBlock)

        // transition out of code section
      } else if (inCodeBlock && Readme.isCodeEndTag(line)) {

        inCodeBlock = false;

        this.blocks[this.blocks.length - 1].content.push(line);

        // still inside code section
      } else if (inCodeBlock && !Readme.isCodeEndTag(line)) {

        this.blocks[this.blocks.length - 1].content.push(line);

        // entered new content block
      } else if (Readme.isHeader(line)) {

        currentHeaderKey = line;
        this.blocks.push({
          type: 'content',
          header: currentHeaderKey,
          content: []
        });

        // still inside of a content block
      } else {

        const latestBlock = this.blocks[this.blocks.length - 1]; 
        latestBlock.content.push(line)

      }
    }

    // index blocks by header for querying
    this.index();

    return this;

  }

  // index blocks by header to allow for efficient querying
  private index() {

    const indexed: IndexedBlocks = new Map([]);

    for (const block of this.blocks) {

      if (block.type !== 'content') continue;

      const existingIndex = indexed.get(block.header);

      if (existingIndex) {
        existingIndex.push(block);
      } else {
        indexed.set(block.header, [block]);
      }

    }

    this.indexedBlocks = indexed;

  }

  toc(indent:string = '  '):string {

    return this.blocks
      .filter((block): block is Content => Readme.isContentBlock(block) && !Readme.isRootNode(block))
      .map(block => block.header)
      .map(header => {
        const [ marker, ...text ] = header.trim().split(' ');
        const indentCount = marker.length - 1;
        const linkedHeader = Readme.makeLink(text.join('-'));
        return `${Readme.repeat(indent, indentCount)}+ ${linkedHeader}`;
      })
      .join('\n');

  }

  // render readme back out to a string
  export():string {

    let output = '';

    for (const block of this.blocks) {
      if (block.type === 'content') {
        if (!Readme.isRootNode(block)) {
          output += block.header + '\n';
        }
      }
      output += block.content.join('\n') + '\n'; 
    }

    return output;

  }

  // find a non-code block by header
  getSection(target: Query, strict=false): Content | null {

    return this.getSections(target)[0] || null;

  }

  // find non-code blocks by header
  getSections(target: Query, strict=false): Content[] {

    const blocks:Content[] = [];

    if (typeof target === 'string') {
      for (const [key, contentBlocks] of this.indexedBlocks.entries()) { 
        if (strict) {
          if (key === target) {
            blocks.push(...contentBlocks);
          }
        } else {
          if (key.includes(target)) {
            blocks.push(...contentBlocks);
          }
        }
      }
    } else if (target instanceof RegExp) {

      for (const [key, contentBlocks] of this.indexedBlocks.entries()) { 
        if (target.test(key)) {
          blocks.push(...contentBlocks);
        }
      }
    }

    return blocks;

  }

  // todo: prependContent(target: Query | null) to insert new sections
  // todo: appendContent(target: Query | null) to insert new sections

  // set first found section (targeted by string/regex) to supplied content
  setSection(target: Query, content: string = '') {

    const sections: Block[] = this.getSections(target);

    if (sections.length > 0) {
      sections[0].content = content.split('\n');
    }

  }

}
