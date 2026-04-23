import type { Plugin } from 'vite';
import { copyFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, relative } from 'path';

export function filterPublicPlugin(): Plugin {
  return {
    name: 'filter-public',
    apply: 'build',
    closeBundle() {
      const publicDir = 'public';
      const outDir = 'dist';

      function copyDir(src: string, dest: string) {
        try {
          const entries = readdirSync(src);

          for (const entry of entries) {
            if (entry.includes('copy')) continue;

            const srcPath = join(src, entry);
            const destPath = join(dest, entry);

            try {
              const stat = statSync(srcPath);

              if (stat.isDirectory()) {
                mkdirSync(destPath, { recursive: true });
                copyDir(srcPath, destPath);
              } else {
                copyFileSync(srcPath, destPath);
              }
            } catch (err) {
              console.log(`Skipping ${entry}`);
            }
          }
        } catch (err) {
          console.log('Error copying public files');
        }
      }
    }
  };
}
