
/// <reference types="vite/client" />

// Add support for jsonb fields to prevent TypeScript errors with arbitrary object shapes
interface JsonObject {
  [key: string]: Json;
}

type Json = string | number | boolean | null | JsonObject | Json[];

// Add a declaration for the Metadata object
interface FileUploadMetadata {
  [key: string]: string;
}

// Edge Runtime used in Supabase edge functions
interface EdgeRuntime {
  waitUntil(promise: Promise<any>): void;
}

declare var EdgeRuntime: EdgeRuntime;
