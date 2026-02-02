"use client";

interface RadioItemProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  label: string;
}

export function RadioItem({
  name,
  value,
  checked,
  onChange,
  label,
}: RadioItemProps) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="h-4 w-4 text-teal-600 focus:ring-teal-500"
      />
      <span className="text-gray-800">{label}</span>
    </label>
  );
}
