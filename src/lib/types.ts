export type ToolTab = "shorten" | "bulk" | "qrcode";

export interface ShortLink {
  /** Original long URL provided by the user. */
  originalUrl: string;
  /** Generated short slug, e.g. "a1B2c3". */
  slug: string;
  /** Fully-qualified short URL, e.g. "https://sho.rt/a1B2c3". */
  shortUrl: string;
  /** Creation timestamp (ms). */
  createdAt: number;
}

export type QrErrorCorrection = "L" | "M" | "Q" | "H";

export interface QrOptions {
  /** Content encoded in the QR (URL or free text). */
  value: string;
  /** Pixel size of the square QR image. */
  size: number;
  /** Foreground (dots) color, hex without leading #. */
  color: string;
  /** Background color, hex without leading #. */
  background: string;
  /** Redundancy level — higher survives more damage but is denser. */
  errorCorrection: QrErrorCorrection;
  /** Optional center logo as a data URL. Applied to the PNG output only. */
  logo?: string | null;
}
