import { Language } from '@/content/types';

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1078;

export const PHOTO_BOUNDS = {
  x: 210,
  y: 637,
  w: 326,
  h: 343,
};

export const TEXT_BOX = {
  x: 565,
  y: 738,
  w: 420,
  h: 122,
  cx: 775,
};

export interface FrameStudioState {
  frameIndex: number; // 0 = Teal, 1 = Clay
  userImage: HTMLImageElement | null;
  zoom: number;
  offsetX: number;
  offsetY: number;
  name: string;
  designation: string;
  language?: Language;
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxSize: number,
  minSize: number,
  maxWidth: number,
  fontWeight: number = 600
): number {
  let size = maxSize;
  do {
    ctx.font = `${fontWeight} ${size}px 'Hind Siliguri', sans-serif`;
    size -= 2;
  } while (ctx.measureText(text).width > maxWidth && size > minSize);
  return size + 2;
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, R: typeof PHOTO_BOUNDS, isTeal: boolean, lang: Language) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(R.x, R.y, R.w, R.h);
  ctx.clip();

  const g = ctx.createLinearGradient(R.x, R.y, R.x + R.w, R.y + R.h);
  if (isTeal) {
    g.addColorStop(0, '#ecfbf8');
    g.addColorStop(1, '#c6ebf5');
  } else {
    g.addColorStop(0, '#f0f7ff');
    g.addColorStop(1, '#dbeafe');
  }
  ctx.fillStyle = g;
  ctx.fillRect(R.x, R.y, R.w, R.h);

  // Background bubbles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(R.x + R.w * 0.88, R.y + R.h * 0.1, 92, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = isTeal ? 'rgba(63, 196, 212, 0.15)' : 'rgba(14, 165, 233, 0.15)';
  ctx.beginPath();
  ctx.arc(R.x + R.w * 0.08, R.y + R.h * 0.92, 110, 0, Math.PI * 2);
  ctx.fill();

  const cx = R.x + R.w / 2;

  // Avatar head
  ctx.fillStyle = isTeal ? 'rgba(27, 143, 157, 0.22)' : 'rgba(2, 132, 199, 0.22)';
  ctx.beginPath();
  ctx.arc(cx, R.y + R.h * 0.29, 44, 0, Math.PI * 2);
  ctx.fill();

  // Avatar body
  ctx.beginPath();
  ctx.ellipse(cx, R.y + R.h * 0.66, 92, 70, 0, Math.PI, 0);
  ctx.fill();

  // Button badge "ছবি যোগ করুন"
  const bw = 240;
  const bh = 58;
  const bx = cx - bw / 2;
  const by = R.y + R.h * 0.74;

  const btnGrad = ctx.createLinearGradient(bx, by, bx + bw, by);
  if (isTeal) {
    btnGrad.addColorStop(0, '#1b8f9d');
    btnGrad.addColorStop(1, '#3fc4d4');
  } else {
    btnGrad.addColorStop(0, '#0284c7');
    btnGrad.addColorStop(1, '#0ea5e9');
  }

  ctx.fillStyle = btnGrad;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(bx, by, bw, bh, 29);
  } else {
    ctx.rect(bx, by, bw, bh);
  }
  ctx.fill();

  // Plus icon
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(bx + 32, by + bh / 2, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isTeal ? '#1b8f9d' : '#0284c7';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(bx + 25, by + bh / 2);
  ctx.lineTo(bx + 39, by + bh / 2);
  ctx.moveTo(bx + 32, by + bh / 2 - 7);
  ctx.lineTo(bx + 32, by + bh / 2 + 7);
  ctx.stroke();

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = "600 27px 'Hind Siliguri', sans-serif";
  ctx.fillText(lang === 'bn' ? 'ছবি যোগ করুন' : 'Add photo', bx + 58, by + bh / 2 + 2);

  ctx.restore();
}

export function renderFrame(
  canvas: HTMLCanvasElement,
  state: FrameStudioState,
  frameTemplates: (HTMLImageElement | null)[]
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const R = PHOTO_BOUNDS;
  const isTeal = state.frameIndex === 0;
  const frameImg = frameTemplates[state.frameIndex];

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 1. Draw the frame template (it already contains the photo-slot placeholder)
  const frameReady = !!(frameImg && frameImg.complete && frameImg.naturalWidth);
  if (frameReady) {
    ctx.drawImage(frameImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  // 2. Draw the user photo ON TOP of the frame, clipped to the photo card
  //    (rounded top-left and bottom-right corners, like the frame artwork).
  if (state.userImage && state.userImage.complete && state.userImage.naturalWidth) {
    const r = 64;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(R.x + r, R.y);
    ctx.lineTo(R.x + R.w, R.y);
    ctx.lineTo(R.x + R.w, R.y + R.h - r);
    ctx.arcTo(R.x + R.w, R.y + R.h, R.x + R.w - r, R.y + R.h, r);
    ctx.lineTo(R.x, R.y + R.h);
    ctx.lineTo(R.x, R.y + r);
    ctx.arcTo(R.x, R.y, R.x + r, R.y, r);
    ctx.closePath();
    ctx.clip();

    const scale = Math.max(R.w / state.userImage.width, R.h / state.userImage.height) * state.zoom;
    const w = state.userImage.width * scale;
    const h = state.userImage.height * scale;

    const maxPanX = (w - R.w) / 2;
    const maxPanY = (h - R.h) / 2;
    const clampedX = Math.max(-maxPanX, Math.min(maxPanX, state.offsetX));
    const clampedY = Math.max(-maxPanY, Math.min(maxPanY, state.offsetY));

    ctx.drawImage(
      state.userImage,
      R.x + R.w / 2 - w / 2 + clampedX,
      R.y + R.h / 2 - h / 2 + clampedY,
      w,
      h
    );
    ctx.restore();
  } else if (!frameReady) {
    drawPlaceholder(ctx, R, isTeal, state.language ?? 'bn');
  }
  // 3. Draw Name and Designation Box
  const B = TEXT_BOX;
  const cx = B.cx;

  // Background patch matching frame's card color
  ctx.fillStyle = isTeal ? '#e6f5fc' : '#fcf2e6';
  ctx.fillRect(B.x, B.y, B.w, B.h);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const name = state.name.trim() || (state.language === 'en' ? 'Your name' : 'আপনার নাম');
  const designation = state.designation.trim() || (state.language === 'en' ? 'Your designation' : 'আপনার পরিচয়');

  // Check if designation needs multiple lines
  ctx.font = "500 40px 'Hind Siliguri', sans-serif";
  const desWidth = ctx.measureText(designation).width;

  if (desWidth > 400 && designation.includes(' ')) {
    const words = designation.split(' ');
    let bestSplit = 1;
    let minDiff = 1e9;
    for (let i = 1; i < words.length; i++) {
      const len1 = words.slice(0, i).join(' ').length;
      const len2 = words.slice(i).join(' ').length;
      const diff = Math.abs(len1 - len2);
      if (diff < minDiff) {
        minDiff = diff;
        bestSplit = i;
      }
    }
    const line1 = words.slice(0, bestSplit).join(' ');
    const line2 = words.slice(bestSplit).join(' ');

    ctx.fillStyle = '#c4161c';
    fitText(ctx, name, 54, 28, 400, 700);
    ctx.fillText(name, cx, 772);

    ctx.fillStyle = '#1a1a1a';
    fitText(ctx, line1, 32, 20, 400, 500);
    ctx.fillText(line1, cx, 812);

    fitText(ctx, line2, 32, 20, 400, 500);
    ctx.fillText(line2, cx, 848);
  } else {
    ctx.fillStyle = '#c4161c';
    fitText(ctx, name, 62, 28, 400, 700);
    ctx.fillText(name, cx, 787);

    ctx.fillStyle = '#1a1a1a';
    fitText(ctx, designation, 40, 20, 400, 500);
    ctx.fillText(designation, cx, 839);
  }
}
