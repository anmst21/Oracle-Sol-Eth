"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useCategory() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const setCategory = useCallback(
    (slug: string) => {
      const newPath = `/blog?${createQueryString("category", slug)}`;
      router.push(newPath);
      router.refresh();
    },
    [createQueryString, router]
  );

  return { activeCategory, setCategory };
}
