"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function SearchFilter({
  defaultSearch = "",
  defaultStartDate = "",
  defaultEndDate = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(defaultSearch);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const handleFilter = () => {
    const params = new URLSearchParams();

    if (search && search.trim()) {
      params.set("search", search.trim());
    }
    if (startDate) {
      params.set("startDate", startDate);
    }
    if (endDate) {
      params.set("endDate", endDate);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        alert("Start date cannot be after end date");
        return;
      }
    }

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(url);
  };

  const handleReset = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    router.push(pathname);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleFilter();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search by Name
          </label>
          <input
            type="text"
            placeholder="Search by tutor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div>

       {/*  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Registration From
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div> */}

       {/*  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Registration To
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div> */}
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={handleFilter}
          className="px-6 py-2.5 bg-linear-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Search Tutors
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Reset Filters
        </button>
      </div>

      {(search || startDate || endDate) && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Active filters:
            </span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full">
                {search}
                <button
                  onClick={() => {
                    setSearch("");
                    handleFilter();
                  }}
                  className="ml-1 hover:text-sky-900 dark:hover:text-sky-100"
                >
                  ×
                </button>
              </span>
            )}
            {startDate && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                From: {new Date(startDate).toLocaleDateString()}
                <button
                  onClick={() => {
                    setStartDate("");
                    handleFilter();
                  }}
                  className="ml-1 hover:text-green-900 dark:hover:text-green-100"
                >
                  ×
                </button>
              </span>
            )}
            {endDate && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                To: {new Date(endDate).toLocaleDateString()}
                <button
                  onClick={() => {
                    setEndDate("");
                    handleFilter();
                  }}
                  className="ml-1 hover:text-green-900 dark:hover:text-green-100"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
