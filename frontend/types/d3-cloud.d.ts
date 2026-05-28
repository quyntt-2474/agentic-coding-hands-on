declare module 'd3-cloud' {
  interface Word {
    text?: string;
    size?: number;
    x?: number;
    y?: number;
    rotate?: number;
    [key: string]: unknown;
  }

  interface Cloud<T extends Word> {
    size(size: [number, number]): this;
    words(words: T[]): this;
    padding(padding: number | ((word: T, index: number) => number)): this;
    rotate(rotate: number | ((word: T, index: number) => number)): this;
    font(font: string | ((word: T, index: number) => string)): this;
    fontSize(size: number | ((word: T, index: number) => number)): this;
    on(event: 'end', callback: (words: T[]) => void): this;
    start(): this;
    stop(): this;
  }

  function cloud<T extends Word>(): Cloud<T>;

  namespace cloud {
    export type { Word, Cloud };
  }

  export = cloud;
}
