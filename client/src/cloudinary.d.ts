// cloudinary.d.ts
interface CloudinaryUploadWidget {
  openUploadWidget(
    options: any,
    callback: (error: any, result: any) => void
  ): void;
}

declare global {
  interface Window {
    cloudinary: CloudinaryUploadWidget;
  }
}
