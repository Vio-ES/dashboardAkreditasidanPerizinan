import { AgendaListProps } from '@/types';
import React, { useMemo } from 'react';

export function AgendaList( {currentDate, selectedDate, events} : AgendaListProps){
  // 1. Filter agenda untuk HARI yang dipilih
  const dailyEvents = useMemo(() => {
    // Format selectedDate ke YYYY-MM-DD lokal
    if (!selectedDate) return [];

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const selectedIso = `${year}-${month}-${day}`;

    return events.filter((e) => e.date === selectedIso);
  }, [selectedDate, events]);

  // 2. Filter agenda untuk BULAN yang sedang aktif
  const monthlyEvents = useMemo(() => {
    return events.filter((e) => {
      const [y, m] = e.date.split('-').map(Number);
      return y === currentDate.getFullYear() && (m - 1) === currentDate.getMonth();
    });
  }, [currentDate, events]);

  // Format teks untuk header
  const formattedSelectedDate = selectedDate
  ? selectedDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  : 'Semua Agenda';

  const formattedMonth = currentDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* SECTION 1: AGENDA HARI INI (TANGGAL PILIHAN) */}
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-4 sm:p-6">
        <div className="border-b border-slate-100 pb-3 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Agenda Harian
          </span>
          <h3 className="text-lg font-bold text-slate-800">{formattedSelectedDate}</h3>
        </div>

        {/* Kondisi jika ada agenda vs jika KOSONG */}
        {dailyEvents.length > 0 ? (
          <div className="space-y-3">
            {dailyEvents.map((item) => (
              <div key={item.id} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-3">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2 py-1 rounded-md h-fit whitespace-nowrap">
                  {item.time}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                  {item.category && <p className="text-xs text-slate-500 mt-1">{item.category}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tampilan ketika tanggal dipilih tetapi tidak ada agenda */
          <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
            <p className="text-sm font-medium text-slate-400">Tidak ada agenda untuk tanggal ini.</p>
          </div>
        )}
      </div>

      {/* SECTION 2: OVERVIEW AGENDA BULANAN */}
      <div className=" w-full max-w-md mx-auto bg-white rounded-2xl p-4 sm:p-6">
        <div className="flex-1 justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Overview Ringkas
            </span>
            <h3 className="text-base font-bold text-slate-800">Bulan {formattedMonth}</h3>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
            {monthlyEvents.length} Event
          </span>
        </div>

        {monthlyEvents.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {monthlyEvents.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs p-2 rounded-lg hover:bg-slate-50">
                <span className="font-medium text-slate-700 truncate flex-1 mr-2 min-w-0">{item.title}</span>
                <span className="text-slate-400 font-mono">{item.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-3">Tidak ada kegiatan di bulan ini.</p>
        )}
      </div>
    </div>
  );
};

export default AgendaList;