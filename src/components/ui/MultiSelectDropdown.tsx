import { useState, useRef, useEffect } from "react";

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown ketika pengguna mengeklik di luar komponen.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function toggleOption(option: string) {
    if (selected.includes(option)) {
      const updated = selected.filter((item) => item !== option);

      // Jangan biarkan semua pilihan kosong.
      onChange(updated.length === 0 ? options : updated);
    } else {
      onChange([...selected, option]);
    }
  }

  const allSelected = selected.length === options.length;

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-48">
      {/* Tombol pembuka dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3
                   rounded-lg border border-base-200 bg-white
                   px-3 py-2 text-sm
                   hover:bg-base-200"
      >
        <span className="truncate">
          {label}: {allSelected ? "Semua" : `${selected.length} dipilih`}
        </span>

        <span className="shrink-0">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Isi dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-1
                     w-full rounded-lg border border-base-200
                     bg-white p-2 shadow-lg"
        >
          {/* Pilihan semua */}
          <label
            className="flex cursor-pointer items-center gap-2
                            rounded-md px-2 py-2 text-sm
                            hover:bg-base-200"
          >
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => onChange(allSelected ? [options[0]] : options)}
            />
            Semua
          </label>

          <div className="my-1 border-t border-base-200" />

          {/* Pilihan individual */}
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2
                         rounded-md px-2 py-2 text-sm
                         hover:bg-base-200"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
