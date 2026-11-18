import { CANVAS_WIDTH, CANVAS_HEIGHT, FrameStudioState, renderFrame } from './frameDraw';

export async function readPhoto(file: File): Promise<HTMLImageElement> {
  if (file.type && !file.type.startsWith('image/')) throw new Error('Invalid image');
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => image.naturalWidth ? resolve(image) : reject(new Error('Empty image'));
      image.onerror = () => reject(new Error('Image decode failed'));
      image.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function exportFrame(state: FrameStudioState, templates: (HTMLImageElement | null)[], scale = 1): Promise<Blob> {
  const template = templates[state.frameIndex];
  if (!template?.naturalWidth) throw new Error('Frame template unavailable');
  await document.fonts.load("600 40px 'Hind Siliguri'");
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH * scale;
  canvas.height = CANVAS_HEIGHT * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.scale(scale, scale);
  renderFrame(canvas, state, templates);
  return new Promise((resolve, reject) => canvas.toBlob(blob => {
    if (blob) resolve(blob);
    else reject(new Error('PNG export failed'));
  }, 'image/png'));
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Some mobile browsers consume the URL after the click handler has returned.
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
