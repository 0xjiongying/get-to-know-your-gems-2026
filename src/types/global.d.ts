export {};

declare global {
  interface Window {
    __alphagemsEvents?: Array<{
      event: string;
      props: Record<string, string | number | boolean>;
      at: string;
    }>;
  }
}
