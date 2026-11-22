"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import { api } from "@/lib/api";
import { CATEGORY_NAMES, RENTAL_TYPES, SORT_OPTIONS } from "@/lib/constants";
import EquipmentCard from "@/components/EquipmentCard";
import { EmptyState, ErrorState, Pagination } from "@/components/ui";

const EMPTY = {
  search: "",
  category: "",
  rentalType: "",
  minPrice: "",
  maxPrice: "",
  availability: "",
  sort: "recent",
  page: 1,
};

const PAGE_SIZE = 9;

function readFilters(params) {
  return {
    search: params.get("search") || "",
    category: CATEGORY_NAMES.includes(params.get("category")) ? params.get("category") : "",
    rentalType: RENTAL_TYPES.includes(params.get("rentalType")) ? params.get("rentalType") : "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    availability: ["available", "unavailable"].includes(params.get("availability")) ? params.get("availability") : "",
    sort: SORT_OPTIONS.some((option) => option.value === params.get("sort")) ? params.get("sort") : "recent",
    page: Math.max(1, parseInt(params.get("page"), 10) || 1),
  };
}

function toQuery(filters) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === "" || value === EMPTY[key]) continue;
    query.set(key, String(value));
  }
  return query.toString();
}

function SkeletonCard() {
  return (
    <div className="card-surface overflow-hidden">
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-9 w-full" />
      </div>
    </div>
  );
}

// All filtering, sorting and paging happens on the server; this component only sends the choices.
export default function EquipmentBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(() => readFilters(searchParams));
  const [searchText, setSearchText] = useState(filters.search);
  const [result, setResult] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const requestId = useRef(0);

  // Any change except the page number goes back to page 1.
  const change = (patch) => setFilters((current) => ({ ...current, page: 1, ...patch }));

  // Wait until the visitor stops typing before searching.
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) => (current.search === searchText.trim() ? current : { ...current, search: searchText.trim(), page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const query = toQuery(filters);
      const data = await api(`/equipment?limit=${PAGE_SIZE}${query ? `&${query}` : ""}`, { auth: false });
      if (id === requestId.current) setResult(data);
    } catch (err) {
      if (id === requestId.current) setError(err.message);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
    // Keep the address bar in sync so a filtered view can be shared or reloaded.
    const query = toQuery(filters);
    router.replace(query ? `/equipment?${query}` : "/equipment", { scroll: false });
  }, [filters, load, router]);

  const reset = () => {
    setSearchText("");
    setFilters(EMPTY);
  };

  const activeCount = ["category", "rentalType", "minPrice", "maxPrice", "availability"].filter((key) => filters[key]).length;

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="mb-2 text-sm font-bold">Category</legend>
        <select
          className="select select-bordered w-full"
          value={filters.category}
          onChange={(event) => change({ category: event.target.value })}
          aria-label="Equipment category"
        >
          <option value="">All categories</option>
          {CATEGORY_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">Rental type</legend>
        <div className="flex flex-wrap gap-2">
          {["", ...RENTAL_TYPES].map((type) => (
            <button
              key={type || "all"}
              type="button"
              onClick={() => change({ rentalType: type })}
              aria-pressed={filters.rentalType === type}
              className={`btn btn-sm ${filters.rentalType === type ? "btn-primary" : "btn-outline"}`}
            >
              {type || "Any"}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">Price range ($)</legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min"
            aria-label="Minimum price"
            className="input input-bordered w-full"
            value={filters.minPrice}
            onChange={(event) => change({ minPrice: event.target.value })}
          />
          <span className="text-base-content/50">to</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max"
            aria-label="Maximum price"
            className="input input-bordered w-full"
            value={filters.maxPrice}
            onChange={(event) => change({ maxPrice: event.target.value })}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">Availability</legend>
        <select
          className="select select-bordered w-full"
          value={filters.availability}
          onChange={(event) => change({ availability: event.target.value })}
          aria-label="Availability"
        >
          <option value="">Show all</option>
          <option value="available">Available now</option>
          <option value="unavailable">Currently unavailable</option>
        </select>
      </fieldset>

      <button type="button" onClick={reset} className="btn btn-outline btn-sm">
        <FiX /> Clear all filters
      </button>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      <aside className="hidden lg:block">
        <div className="card-surface sticky top-24 p-6">
          <h2 className="mb-5 text-lg font-bold">Filters</h2>
          {filterPanel}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="input input-bordered flex flex-1 items-center gap-2">
            <FiSearch className="size-4 shrink-0 text-base-content/50" />
            <span className="sr-only">Search equipment</span>
            <input
              type="search"
              className="grow"
              placeholder="Search by equipment name or location"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </label>

          <div className="flex gap-3">
            <select
              className="select select-bordered flex-1 sm:w-52"
              value={filters.sort}
              onChange={(event) => change({ sort: event.target.value })}
              aria-label="Sort equipment"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline lg:hidden"
              onClick={() => setShowFilters((value) => !value)}
              aria-expanded={showFilters}
            >
              <FiSliders /> Filters{activeCount ? ` (${activeCount})` : ""}
            </button>
          </div>
        </div>

        {showFilters && <div className="card-surface mt-4 p-5 lg:hidden">{filterPanel}</div>}

        <p className="mt-5 text-sm text-base-content/65" aria-live="polite">
          {loading ? "Searching…" : `${result.total} ${result.total === 1 ? "item" : "items"} found`}
        </p>

        <div className="mt-4">
          {error ? (
            <ErrorState message={error} onRetry={load} />
          ) : loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : result.items.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((item) => (
                  <EquipmentCard key={item._id} item={item} />
                ))}
              </div>
              <Pagination page={filters.page} pages={result.pages} onChange={(page) => setFilters((current) => ({ ...current, page }))} />
            </>
          ) : (
            <EmptyState title="No equipment matches these filters" text="Try a different search term or clear the filters to see everything.">
              <button type="button" onClick={reset} className="btn btn-primary btn-sm">
                Clear all filters
              </button>
            </EmptyState>
          )}
        </div>
      </div>
    </div>
  );
}
