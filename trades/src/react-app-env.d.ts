/// <reference types="react-scripts" />

declare module '@metamask/jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement;
}

interface Window {
  ethereum?: {
    isCoinbaseWallet?: boolean;
    isMetaMask?: true;
    request: (...args: any[]) => Promise<any[]>;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    send: unknown;
    enable: () => Promise<string[]>;
  };
  web3?: {};
}

declare module 'content-hash' {
  declare function decode(x: string): string;
  declare function getCodec(x: string): string;
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): {
    code: number;
    name: string;
    length: number;
    digest: Uint8Array;
  };
  declare function toB58String(hash: Uint8Array): string;
}

declare module '*.yaml' {
  const data: any;
  export default data;
}
