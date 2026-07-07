import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Applies the persisted (or system) theme to <html> before first paint so
 * the page never flashes the wrong palette. Runs synchronously in <head>.
 */
export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY,
  )});if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}var e=document.documentElement;e.dataset.theme=t;e.style.colorScheme=t;}catch(_){document.documentElement.dataset.theme="dark";}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
