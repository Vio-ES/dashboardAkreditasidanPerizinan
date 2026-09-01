import { CalendarProps } from "@/types";
import { useState } from "react";

export function Calendar({ currentDate, selectedDate, onMonthChange, onSelectDate }: CalendarProps){

    const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    // Mendapatkan info bulan dan tahun
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Tanggal pertama & jumlah hari dalam bulan ini
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Navigasi Bulan
    const prevMonth = () => onMonthChange(new Date(year, month - 1, 1));
    const nextMonth = () => onMonthChange(new Date(year, month + 1, 1));

    // Handle click logic with toggle capability
    const handleDateClick = (clickedDay: number) => {
        const clickedDate = new Date(year, month, clickedDay);

        // Check if a date is already selected AND matches the clicked day
        const isAlreadySelected = 
            selectedDate &&
            selectedDate.getDate() === clickedDay &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;

        if (isAlreadySelected) {
            onSelectDate(null); // Unselect / unchoose date
        } else {
            onSelectDate(clickedDate); // Select new date
        }
    };

    // Generate grid tanggal
    const renderDays = () => {
        const days = [];

        // Slot kosong sebelum tanggal 1
        for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        // Tanggal bulan berjalan
        for (let day = 1; day <= daysInMonth; day++) {
        const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

        const isSelected = Boolean(
            selectedDate &&
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear()
        );

        days.push(
            <button
            key={day}
            onClick={() => onSelectDate(new Date(year, month, day))}
            className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${isSelected ? 'bg-indigo-600 text-white font-bold' : ''}
                ${!isSelected && isToday ? 'border-2 border-indigo-600 text-indigo-600' : ''}
                ${!isSelected && !isToday ? 'hover:bg-slate-100 text-slate-700' : ''}
            `}
            >
            {day}
            </button>
        );
        }

        return days;
    };

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
        {/* Header: Month/Year & Navigation */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">
            {monthNames[month]} {year}
            </h2>
            <div className="flex space-x-2">
            <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
                &#8249;
            </button>
            <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
                &#8250;
            </button>
            </div>
        </div>

        {/* Grid Nama Hari */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day) => (
            <div key={day} className="text-xs font-semibold text-slate-400 py-1">
                {day}
            </div>
            ))}
        </div>

        {/* Grid Tanggal */}
        <div className="grid grid-cols-7 gap-1 place-items-center">
            {renderDays()}
        </div>
        </div>
    );
}