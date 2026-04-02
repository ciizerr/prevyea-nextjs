"use client";

import { useState, useMemo, useTransition } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, X, Sparkles } from "lucide-react";
import dayjs from "dayjs";
import { addHolidays, deleteHoliday } from "@/actions/holidays";
import { toast } from "sonner";

interface Holiday {
    date: string;
    name: string;
    year: number;
}

export default function HolidayManagement({ allHolidays }: { allHolidays: Holiday[] }) {
    const currentYear = dayjs().year();
    const [selectedYear, setSelectedYear] = useState(2026);
    const initialDate = dayjs(`${selectedYear}-01-01`);
    const [currentDate, setCurrentDate] = useState(initialDate);
    
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [holidayName, setHolidayName] = useState("");
    const [isPending, startTransition] = useTransition();

    // Ensure calendar stays within selected year
    const handlePrevMonth = () => {
        const newDate = currentDate.subtract(1, 'month');
        if (newDate.year() === selectedYear) setCurrentDate(newDate);
    };
    const handleNextMonth = () => {
        const newDate = currentDate.add(1, 'month');
        if (newDate.year() === selectedYear) setCurrentDate(newDate);
    };
    
    // When year changes, reset calendar to Jan 1 of that year
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = parseInt(e.target.value);
        setSelectedYear(year);
        setCurrentDate(dayjs(`${year}-01-01`));
        setSelectedDates([]); // clear selection
    };

    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfMonth = currentDate.startOf('month').day();
    const currentMonthName = currentDate.format("MMMM YYYY");

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    // Holidays for selected year
    const holidaysForYear = useMemo(() => allHolidays.filter(h => h.year === selectedYear), [allHolidays, selectedYear]);

    // Fast lookup for calendar rendering
    const holidaysMap = useMemo(() => {
        const map: Record<string, string> = {};
        holidaysForYear.forEach(h => { map[h.date] = h.name; });
        return map;
    }, [holidaysForYear]);

    const toggleDate = (day: number) => {
        const dateStr = `${currentDate.format('YYYY-MM')}-${String(day).padStart(2, '0')}`;
        if (selectedDates.includes(dateStr)) {
            setSelectedDates(selectedDates.filter(d => d !== dateStr));
        } else {
            setSelectedDates([...selectedDates, dateStr]);
        }
    };

    const handleSaveHolidays = () => {
        if (selectedDates.length === 0 || !holidayName.trim()) {
            toast.error("Please select dates and enter a holiday name.");
            return;
        }
        
        startTransition(async () => {
            const res = await addHolidays(selectedDates, holidayName.trim(), selectedYear);
            if (res.success) {
                toast.success("Holidays saved successfully.");
                setHolidayName("");
                setSelectedDates([]);
            } else {
                toast.error(res.error || "Failed to save holidays.");
            }
        });
    };

    const handleDeleteHoliday = (date: string) => {
        startTransition(async () => {
            const res = await deleteHoliday(date);
            if (res.success) {
                toast.success("Holiday deleted.");
                setSelectedDates(selectedDates.filter(d => d !== date)); // if it was selected
            } else {
                toast.error(res.error || "Failed to delete.");
            }
        });
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Select Year</label>
                    <select 
                        value={selectedYear} 
                        onChange={handleYearChange}
                        className="block w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-bold outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                        {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendar View */}
                <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-[2rem] p-6 border border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center justify-between mb-6">
                        <button 
                            onClick={handlePrevMonth}
                            disabled={currentDate.month() === 0}
                            className="p-2 bg-white dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                        </button>
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-wide uppercase">
                            {currentMonthName}
                        </span>
                        <button 
                            onClick={handleNextMonth}
                            disabled={currentDate.month() === 11}
                            className="p-2 bg-white dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                            <div key={day} className="text-[10px] font-black text-zinc-400 uppercase">{day}</div>
                        ))}
                        
                        {days.map((day, idx) => {
                            if (!day) return <div key={idx} className="w-8 h-8" />;
                            
                            const dateStr = `${currentDate.format('YYYY-MM')}-${String(day).padStart(2, '0')}`;
                            const isHoliday = !!holidaysMap[dateStr];
                            const isSelected = selectedDates.includes(dateStr);
                            const isSunday = idx % 7 === 0;

                            return (
                                <div key={idx} className="flex items-center justify-center p-1">
                                    <button 
                                        onClick={() => toggleDate(day)}
                                        title={isHoliday ? holidaysMap[dateStr] : undefined}
                                        className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                                            isSelected
                                                ? "bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-500/50 ring-offset-2 dark:ring-offset-zinc-950"
                                                : isHoliday 
                                                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30" 
                                                    : isSunday
                                                        ? "text-red-500 dark:text-red-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                        }`}
                                    >
                                        {day}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Holiday Creation & List */}
                <div className="flex flex-col h-full space-y-6">
                    {/* Entry Form */}
                    <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5">
                        <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add New Holiday
                        </h4>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Selected Dates ({selectedDates.length})</label>
                                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                                    {selectedDates.length === 0 && <span className="text-xs text-zinc-500">Click dates on the calendar to select...</span>}
                                    {selectedDates.sort().map(d => (
                                        <span key={d} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-200/50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-lg uppercase">
                                            {dayjs(d).format('DD MMM')}
                                            <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => toggleDate(parseInt(d.split('-')[2]))} />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Holiday Name</label>
                                <input 
                                    type="text" 
                                    value={holidayName}
                                    onChange={(e) => setHolidayName(e.target.value)}
                                    placeholder="e.g. Winter Break" 
                                    className="w-full px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-white dark:bg-zinc-900 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>

                            <button
                                onClick={handleSaveHolidays}
                                disabled={isPending || selectedDates.length === 0 || !holidayName.trim()}
                                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Saving..." : "Save Holidays"}
                            </button>
                        </div>
                    </div>

                    {/* Current Holidays List */}
                    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
                            <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Saved Holidays ({holidaysForYear.length})</h4>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar max-h-64">
                            {holidaysForYear.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 opacity-60">
                                    <Sparkles className="w-5 h-5 text-zinc-400 mb-2" />
                                    <p className="text-xs font-bold text-zinc-500">No holidays set for {selectedYear}</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {holidaysForYear.map((h) => (
                                        <div key={h.date} className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 group transition-colors">
                                            <div>
                                                <p className="text-[10px] font-black tracking-widest text-amber-600 dark:text-amber-500 uppercase">{dayjs(h.date).format("DD MMM")}</p>
                                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{h.name}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteHoliday(h.date)}
                                                disabled={isPending}
                                                className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
