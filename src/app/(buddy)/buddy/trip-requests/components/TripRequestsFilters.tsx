"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DateFilter, PeopleFilter } from "./types";

type TripRequestsFiltersProps = {
  dateFilter: DateFilter;
  peopleFilter: PeopleFilter;
  languageFilter: string;
  languageOptions: string[];
  onDateFilterChange: (value: DateFilter) => void;
  onPeopleFilterChange: (value: PeopleFilter) => void;
  onLanguageFilterChange: (value: string) => void;
};

type Option = {
  value: string;
  label: string;
};

type FilterDropdownProps = {
  label: string;
  value: string;
  options: Option[];
  onValueChange: (value: string) => void;
};

/* Pill-style dropdown filter – matches the design reference */
function FilterDropdown({ label, value, options, onValueChange }: Readonly<FilterDropdownProps>) {
  const isActive = value !== "All" && value !== options[0]?.value;
  const activeLabel = options.find((o) => o.value === value)?.label ?? label;
  const displayLabel = isActive ? activeLabel : label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400
            ${isActive
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
            }`}
        >
          {displayLabel}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-48 rounded-xl border-slate-200 p-1.5 shadow-lg">
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="rounded-lg px-3 py-2 text-sm cursor-pointer"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TripRequestsFilters({
  dateFilter,
  peopleFilter,
  languageFilter,
  languageOptions,
  onDateFilterChange,
  onPeopleFilterChange,
  onLanguageFilterChange,
}: Readonly<TripRequestsFiltersProps>) {
  const dateOptions: Option[] = [
    { value: "All", label: "All dates" },
    { value: "Today", label: "Today" },
    { value: "ThisWeek", label: "This week" },
    { value: "Weekend", label: "Weekend" },
  ];

  const peopleOptions: Option[] = [
    { value: "All", label: "All sizes" },
    { value: "1-2", label: "1–2 guests" },
    { value: "3-5", label: "3–5 guests" },
    { value: "6+", label: "6+ guests" },
  ];

  const languageAllOptions: Option[] = [
    { value: "All", label: "All languages" },
    ...languageOptions.map((l) => ({ value: l, label: l })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Date / "Price" equivalent */}
      <FilterDropdown
        label="Date"
        value={dateFilter}
        options={dateOptions}
        onValueChange={(v) => onDateFilterChange(v as DateFilter)}
      />

      {/* People / "Occasion" equivalent */}
      <FilterDropdown
        label="Group size"
        value={peopleFilter}
        options={peopleOptions}
        onValueChange={(v) => onPeopleFilterChange(v as PeopleFilter)}
      />

      {/* Language */}
      {languageAllOptions.length > 1 && (
        <FilterDropdown
          label="Language"
          value={languageFilter}
          options={languageAllOptions}
          onValueChange={onLanguageFilterChange}
        />
      )}
    </div>
  );
}
