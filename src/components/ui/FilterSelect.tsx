import { useFilterOptions } from "@/hooks/useModuleData";

interface FilterSelectProps {
  moduleKey: string;
  column: string;
  value: string | number | null;
  options?: readonly string[];
  onFilterChange: (
    columnTarget: string,
    valueTarget: string | number | null,
  ) => void;
  placeholder?: string;
}

export function FilterSelect({
  moduleKey,
  column,
  value,
  options,
  onFilterChange,
  placeholder,
}: FilterSelectProps) {
  const { data } = useFilterOptions(moduleKey, column);

  const finalOptions = options ?? data;

  return (
    <select
      value={value ?? ""}
      onChange={(e) =>
        onFilterChange(column, e.target.value === "" ? null : e.target.value)
      }
      className="rounded-lg border border-line px-3 py-2 text-sm normal-case font-normal outline-none focus:border-border sm:w-56"
    >
      <option value="">{placeholder}</option>
      {finalOptions &&
        finalOptions.map((ops) => (
          <option key={ops} value={ops}>
            {ops}
          </option>
        ))}
    </select>
  );
}
