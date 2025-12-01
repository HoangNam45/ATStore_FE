const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const validateImage = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Kích thước file không được vượt quá 4MB";
  }
  return null;
};

export const MAX_DETAIL_IMAGES = 8;
