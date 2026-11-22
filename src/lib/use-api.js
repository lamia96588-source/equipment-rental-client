"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

// Loads data from the Express API and exposes loading, error and reload.
// Pass null as the path to skip loading. While a reload or a new page is
// loading, the previous data stays available so tables do not flash empty.
export function useApi(path) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ key: null, data: null, error: "" });
  const key = path ? `${path}#${version}` : null;

  useEffect(() => {
    if (!path) return;
    let active = true;
    api(path)
      .then((data) => active && setState({ key, data, error: "" }))
      .catch((err) => active && setState((current) => ({ key, data: current.data, error: err.message })));
    return () => {
      active = false;
    };
  }, [path, key]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  const setData = useCallback((next) => {
    setState((current) => ({ ...current, data: typeof next === "function" ? next(current.data) : next }));
  }, []);

  const loading = key !== null && state.key !== key;

  return { data: state.data, setData, loading, error: loading ? "" : state.error, reload };
}
