/* eslint-disable import/no-anonymous-default-export */
/**
 * lint-staged: CHỈ chạy trên các file đang được `git add` (staged),
 * không quét toàn bộ source code.
 * => Bạn đổi 10 file thì nó chỉ lint đúng 10 file đó.
 */
export default {
  // File JS/TS/JSX/TSX: chạy ESLint và tự động fix
  '**/*.{js,jsx,ts,tsx,mjs,cjs}': ['eslint --fix --no-warn-ignored'],
};
