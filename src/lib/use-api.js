"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "./api";

// Loads data from the Express API and exposes loading, error and reload.
// Pass null as the path to skip loading.
export function useApi(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState("");
  const latest = useRef(0);

  const reload = useCallback(async () => {
    if (!path) return;
    const id = ++latest.current;
    setLoading(true);
    setError("");
    try {
      const result = await api(path);
      if (id === latest.current) setData(result);
    } catch (err) {
      if (id === latest.current) setError(err.message);
    } finally {
      if (id === latest.current) setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, setData, loading, error, reload };
}
