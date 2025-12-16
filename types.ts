export interface ProcessedImage {
  original: string; // Base64 URL
  originalFile: File;
  generated: string | null; // Base64 URL
  history: string[]; // Keep track of versions
}

export interface AppState {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  errorMessage?: string;
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
