"use client";

interface CheckboxChipProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function CheckboxChip({
  label,
  checked,
  onChange,
}: CheckboxChipProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "px-3 py-1.5 rounded-full text-sm border transition",
        checked
          ? "bg-teal-600 text-white border-teal-600 shadow"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
