import { useState } from "react";

import {
  Status,
  STATUS_AKREDITASI_LEMBAGA_OPTIONS,
  STATUS_OPTIONS,
  StatusAkreditasiLembaga,
} from "@/types";
import { useKabupatenKota, useProvinces } from "@/hooks/useProvinces";

interface LembagaFormData {
  vin: number;
  nama_lembaga: string;
  status: Status;
  alamat: string;
  provinsi: string;
  kabupaten_kota: string;
  status_akreditasi_kelembagaan: StatusAkreditasiLembaga;
  tahun_akreditasi: number;
  list_program: string[];
}

interface LembagaFormProps {
  onSuccess: () => void;
}

export function LembagaForm({ onSuccess }: LembagaFormProps) {
  const [formData, setFormData] = useState<LembagaFormData>({
    vin: 0,
    nama_lembaga: "",
    status: "" as Status,
    alamat: "",
    provinsi: "",
    kabupaten_kota: "",
    status_akreditasi_kelembagaan: "" as StatusAkreditasiLembaga,
    tahun_akreditasi: new Date().getFullYear(),
    list_program: [],
  });

  const [programInput, setProgramInput] = useState("");
  const { data: provinces = [] } = useProvinces();
  const selectedProvince = provinces.find((p) => p.nama === formData.provinsi);
  const { data: kabupatenList = [] } = useKabupatenKota(selectedProvince?.id);
  console.log(kabupatenList);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "vin" || name === "tahun_akreditasi" ? Number(value) : value,
    }));
  };

  const handleAddProgram = () => {
    if (!programInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      list_program: [...prev.list_program, programInput.trim()],
    }));

    setProgramInput("");
  };

  const handleRemoveProgram = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      list_program: prev.list_program.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Frontend saja
    console.log("Data Form:", formData);
    onSuccess();
  };

  return (
    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-semibold text-[#15406A]">
        Form Data Lembaga
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* VIN */}
        <div>
          <label className="mb-1 block text-sm font-medium">VIN</label>

          <input
            type="number"
            name="vin"
            value={formData.vin || ""}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#15406A]"
          />
        </div>

        {/* Nama Lembaga */}
        <div>
          <label className="mb-1 block text-sm font-medium">Nama Lembaga</label>

          <input
            type="text"
            name="nama_lembaga"
            value={formData.nama_lembaga}
            onChange={handleChange}
            required
            placeholder="Masukkan nama lembaga"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#15406A]"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">Pilih Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Alamat */}
        <div>
          <label className="mb-1 block text-sm font-medium">Alamat</label>

          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Masukkan alamat lengkap"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#15406A]"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Provinsi */}
          <div>
            <label className="mb-1 block text-sm font-medium">Provinsi</label>

            <select
              name="provinsi"
              value={formData.provinsi}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.nama}>
                  {province.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Kabupaten/Kota */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Kabupaten / Kota
            </label>

            <select
              name="kabupaten_kota"
              value={formData.kabupaten_kota}
              onChange={handleChange}
              required
              disabled={!formData.provinsi}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Pilih Kabupaten / Kota</option>

              {kabupatenList.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Akreditasi */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Status Akreditasi Kelembagaan
          </label>

          <select
            name="status_akreditasi_kelembagaan"
            value={formData.status_akreditasi_kelembagaan}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">Pilih Status Akreditasi</option>

            {STATUS_AKREDITASI_LEMBAGA_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Tahun Akreditasi */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Tahun Akreditasi
          </label>

          <input
            type="number"
            name="tahun_akreditasi"
            value={formData.tahun_akreditasi || ""}
            onChange={handleChange}
            min="1900"
            max="2100"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        {/* List Program */}
        <div>
          <label className="mb-2 block text-sm font-medium">Program</label>

          <div className="flex gap-2">
            <input
              type="text"
              value={programInput}
              onChange={(e) => setProgramInput(e.target.value)}
              placeholder="Masukkan nama program"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
            />

            <button
              type="button"
              onClick={handleAddProgram}
              className="rounded-lg bg-[#56849F] px-4 py-2 text-white"
            >
              Tambah
            </button>
          </div>

          {formData.list_program.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.list_program.map((program, index) => (
                <div
                  key={`${program}-${index}`}
                  className="flex items-center gap-2 rounded-full bg-[#A0BECD] px-3 py-1 text-sm"
                >
                  <span>{program}</span>

                  <button
                    type="button"
                    onClick={() => handleRemoveProgram(index)}
                    className="font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="rounded-lg bg-[#15406A] px-6 py-2 font-medium text-white"
          >
            Simpan Data
          </button>
        </div>
      </form>
    </div>
  );
}
