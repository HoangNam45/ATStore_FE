const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg", // non-standard but seen in some environments
  "image/png",
  "image/x-png", // legacy/alt PNG MIME used by some browsers/tools
  "image/apng", // animated PNG
  "image/webp",
];

export const validateImage = (file: File): string | null => {
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  // Some environments may provide unexpected/legacy PNG types or empty type.
  const isAllowedByType = type ? ALLOWED_IMAGE_TYPES.includes(type) : false;
  const isAllowedByExt = [".jpg", ".jpeg", ".png", ".apng", ".webp"].some(
    (ext) => name.endsWith(ext)
  );

  // Accept if either the MIME matches our allowlist or the filename extension is allowed
  // (and for safety, if type exists and is not an image/* we still block).
  const looksLikeImage = !type || type.startsWith("image/");

  if (!(isAllowedByType || (looksLikeImage && isAllowedByExt))) {
    return "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Kích thước file không được vượt quá 4MB";
  }
  return null;
};

export const MAX_DETAIL_IMAGES = 8;
