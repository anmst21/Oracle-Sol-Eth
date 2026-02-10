import { useEffect } from "react";

export function useBodyScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const originalHtml = html.style.overflow;
    const originalBody = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = originalHtml;
      body.style.overflow = originalBody;
    };
  }, []);
}
