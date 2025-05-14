
/// <reference types="vite/client" />

// Add EdgeRuntime type for Supabase Edge Functions support
interface EdgeRuntime {
  waitUntil(promise: Promise<any>): void;
}

declare var EdgeRuntime: EdgeRuntime;

// Declare modules that might not have TypeScript definitions
declare module 'heic2any' {
  export default function(options: {
    blob: Blob;
    toType?: string;
    quality?: number;
  }): Promise<Blob | Blob[]>;
}
