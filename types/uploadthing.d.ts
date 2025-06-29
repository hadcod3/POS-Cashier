declare module 'uploadthing/react' {
  export function useDropzone(options: any): any;
  // Add other exports you need
}

declare module 'uploadthing/client' {
  export function generateClientDropzoneAccept(types: string[]): any;
}