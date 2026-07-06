import QRCode, { type QRCodeToDataURLOptions } from "qrcode";
import type { QrOptions } from "@/lib/types";

/**
 * Client-side QR generation (no third-party API). One function per output
 * format so components stay dumb — they just await a string.
 */

function baseOptions(options: QrOptions): QRCodeToDataURLOptions {
  return {
    // A logo covers the center, so force max redundancy to stay scannable.
    errorCorrectionLevel: options.logo ? "H" : options.errorCorrection,
    width: options.size,
    margin: 2,
    color: { dark: options.color, light: options.background },
  };
}

/** Render the QR to a PNG data URL, compositing a center logo when provided. */
export async function generateQrPng(options: QrOptions): Promise<string> {
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, options.value, baseOptions(options));

  if (options.logo) {
    await drawLogo(canvas, options.logo, options.background);
  }
  return canvas.toDataURL("image/png");
}

/** Render the QR as a standalone SVG string (vector, logo not included). */
export function generateQrSvg(options: QrOptions): Promise<string> {
  return QRCode.toString(options.value, {
    type: "svg",
    errorCorrectionLevel: options.errorCorrection,
    width: options.size,
    margin: 2,
    color: { dark: options.color, light: options.background },
  });
}

async function drawLogo(
  canvas: HTMLCanvasElement,
  logo: string,
  background: string,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const image = new Image();
  image.src = logo;
  await image.decode();

  const size = canvas.width;
  const logoSize = Math.round(size * 0.22);
  const pad = Math.round(logoSize * 0.16);
  const offset = (size - logoSize) / 2;
  const radius = Math.round(logoSize * 0.2);

  // Padded rounded background so the logo doesn't clash with the QR dots.
  ctx.fillStyle = background || "#ffffff";
  ctx.beginPath();
  ctx.roundRect(
    offset - pad,
    offset - pad,
    logoSize + pad * 2,
    logoSize + pad * 2,
    radius,
  );
  ctx.fill();

  ctx.drawImage(image, offset, offset, logoSize, logoSize);
}
