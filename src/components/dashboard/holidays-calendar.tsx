"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Sparkles, X } from "lucide-react";
import dayjs from "dayjs";
import { getHolidays } from "@/actions/holidays";

export function HolidaysCalendar() {
    const initialDate = dayjs();
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedDateInfo, setSelectedDateInfo] = useState<{ day: number, name: string } | null>(null);
    const [holidayData, setHolidayData] = useState<Record<string, string>>({});

    const currentYear = currentDate.year();

    useEffect(() => {
        getHolidays(currentYear).then(data => {
            const map: Record<string, string> = {};
            data.forEach(h => { map[h.date] = h.name; });
            setHolidayData(map);
        });
    }, [currentYear]);

    const handlePrevMonth = () => {
        setCurrentDate(currentDate.subtract(1, 'month'));
        setSelectedDateInfo(null);
    };
    const handleNextMonth = () => {
        setCurrentDate(currentDate.add(1, 'month'));
        setSelectedDateInfo(null);
    };

    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfMonth = currentDate.startOf('month').day();
    const currentMonthName = currentDate.format("MMMM YYYY");

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null); // Empty slots for previous month
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const { holidaysForMonth, uniqueHolidaysList } = useMemo(() => {
        const monthPrefix = currentDate.format('YYYY-MM');
        
        const holidaysForMonth: Record<number, string> = {};
        const uniqueHolidaysList: { dates: string, name: string }[] = [];
        
        let currentHolidayGroup: { name: string, start: number, end: number, datesList: number[] } | null = null;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${monthPrefix}-${String(day).padStart(2, '0')}`;
            if (holidayData[dateStr]) {
                const holidayName = holidayData[dateStr];
                holidaysForMonth[day] = holidayName;
                
                if (currentHolidayGroup && currentHolidayGroup.name === holidayName) {
                    currentHolidayGroup.end = day;
                    currentHolidayGroup.datesList.push(day);
                } else {
                    if (currentHolidayGroup) {
                        uniqueHolidaysList.push({
                            name: currentHolidayGroup.name,
                            dates: currentHolidayGroup.datesList.length > 1 
                                ? `${currentHolidayGroup.start} - ${currentHolidayGroup.end} ${currentDate.format('MMM')}` 
                                : `${currentHolidayGroup.start} ${currentDate.format('MMM')}`
                        });
                    }
                    currentHolidayGroup = { name: holidayName, start: day, end: day, datesList: [day] };
                }
            } else if (currentHolidayGroup) {
                uniqueHolidaysList.push({
                    name: currentHolidayGroup.name,
                    dates: currentHolidayGroup.datesList.length > 1 
                        ? `${currentHolidayGroup.start} - ${currentHolidayGroup.end} ${currentDate.format('MMM')}` 
                        : `${currentHolidayGroup.start} ${currentDate.format('MMM')}`
                });
                currentHolidayGroup = null;
            }
        }
        
        if (currentHolidayGroup) {
            uniqueHolidaysList.push({
                name: currentHolidayGroup.name,
                dates: currentHolidayGroup.datesList.length > 1 
                    ? `${currentHolidayGroup.start} - ${currentHolidayGroup.end} ${currentDate.format('MMM')}` 
                    : `${currentHolidayGroup.start} ${currentDate.format('MMM')}`
            });
        }

        return { holidaysForMonth, uniqueHolidaysList };
    }, [currentDate, daysInMonth, holidayData]);

    const isToday = (day: number) => {
        const today = dayjs();
        return today.date() === day && today.month() === currentDate.month() && today.year() === currentDate.year();
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" /> PU Calendar
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Academic Holidays</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4 p-4">
                {/* Calendar Widget */}
                <div className="relative z-10 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2rem] p-5 border border-zinc-100 dark:border-zinc-800/50 shrink-0">
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={handlePrevMonth}
                        className="p-2 bg-white dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                    </button>
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-wide uppercase">
                        {currentMonthName}
                    </span>
                    <button 
                        onClick={handleNextMonth}
                        className="p-2 bg-white dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                    >
                        <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <div key={day} className="text-[10px] font-black text-zinc-400 uppercase">
                            {day}
                        </div>
                    ))}
                    
                    {days.map((day, idx) => {
                        const isHoliday = day ? !!holidaysForMonth[day] : false;
                        const todayMark = day && isToday(day);
                        const isSunday = idx % 7 === 0;

                        return (
                            <div key={idx} className="flex items-center justify-center p-1">
                                {day ? (
                                    <button 
                                        onClick={() => {
                                            if (isHoliday) {
                                                setSelectedDateInfo({ day, name: holidaysForMonth[day] });
                                            } else if (isSunday) {
                                                setSelectedDateInfo({ day, name: "Sunday" });
                                            } else {
                                                setSelectedDateInfo(null);
                                            }
                                        }}
                                        title={isHoliday ? holidaysForMonth[day] : undefined}
                                        className={`w-full max-w-[44px] aspect-square flex items-center justify-center rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                                            isHoliday 
                                                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30" 
                                                : isSunday
                                                    ? "text-red-500 dark:text-red-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                                    : todayMark 
                                                        ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                                                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                        } ${selectedDateInfo?.day === day ? 'ring-2 ring-amber-500 dark:ring-amber-400' : ''}`}
                                    >
                                        {day}
                                    </button>
                                ) : (
                                    <div className="w-full max-w-[44px] aspect-square" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

                {/* Selected Date Info (Mobile Friendly) */}
                {selectedDateInfo && (
                    <div className="relative z-10 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl flex items-center justify-between animate-in fade-in zoom-in-95 shrink-0">
                        <div>
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">
                                {`${selectedDateInfo.day} ${currentMonthName}`}
                            </p>
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {selectedDateInfo.name}
                            </p>
                        </div>
                        <button 
                            onClick={() => setSelectedDateInfo(null)}
                            className="p-1.5 hover:bg-amber-200/50 dark:hover:bg-amber-500/20 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </button>
                    </div>
                )}

                {/* Event List */}
                <div className="relative z-10 flex-1 overflow-y-visible">
                {uniqueHolidaysList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-6 opacity-60">
                        <Sparkles className="w-6 h-6 text-zinc-400 mb-2" />
                        <p className="text-xs font-bold text-zinc-500">No holidays this month</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {uniqueHolidaysList.map((holiday, idx) => (
                            <div key={idx} className="flex flex-col p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-transparent hover:border-amber-500/30 transition-colors">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">
                                    {holiday.dates}
                                </span>
                                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                    {holiday.name}
                                </span>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}
