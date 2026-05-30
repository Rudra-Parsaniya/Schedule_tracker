import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayDetails, setDayDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12

  useEffect(() => {
    fetchMonthData(month, year);
  }, [month, year]);

  const fetchMonthData = async (m, y) => {
    setLoading(true);
    try {
      const res = await api.get(`/calendar/monthly?month=${m}&year=${y}`);
      setCalendarData(res.data);
    } catch (error) {
      console.error("Error fetching calendar data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDayDetails = async (dateStr) => {
    setLoadingDetails(true);
    setSelectedDay(dateStr);
    try {
      const dateOnly = dateStr.split('T')[0];
      const res = await api.get(`/calendar/day/${dateOnly}`);
      setDayDetails(res.data);
    } catch (error) {
      console.error("Error fetching day details", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  // Generate grid logic
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 (Sun) to 6 (Sat)
  
  const getIntensityClass = (percentage, totalTasks) => {
    if (totalTasks === 0) return 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-brand-200';
    if (percentage === 0) return 'bg-slate-100 text-slate-500 border border-slate-200';
    if (percentage > 0 && percentage < 40) return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    if (percentage >= 40 && percentage < 75) return 'bg-emerald-300 text-emerald-900 border border-emerald-400';
    if (percentage >= 75 && percentage < 100) return 'bg-emerald-500 text-white border border-emerald-600 shadow-sm';
    if (percentage === 100) return 'bg-emerald-600 text-white shadow-md border-emerald-700 ring-1 ring-emerald-600/50';
    return 'bg-slate-50';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Calendar</h2>
          <p className="text-slate-500 mt-1">Track your monthly task completion heatmap</p>
        </div>
        <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm p-1">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-semibold text-slate-800 min-w-[140px] text-center">
            {currentDate.toLocaleString('default', { month: 'long' })} {year}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="lg:w-2/3">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full rounded-md" />
              <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-7 gap-3 mb-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-3">
                {/* Empty cells for padding */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square rounded-xl bg-transparent"></div>
                ))}
                
                {/* Calendar Days */}
                {calendarData.map((dayData) => {
                  const dayNum = new Date(dayData.date).getDate();
                  const isSelected = selectedDay === dayData.date;
                  return (
                    <button
                      key={dayData.date}
                      onClick={() => fetchDayDetails(dayData.date)}
                      className={`aspect-square rounded-xl flex flex-col justify-center items-center cursor-pointer transition-all duration-200 hover:scale-105 relative overflow-hidden ${getIntensityClass(dayData.completionPercentage, dayData.totalTasks)} ${isSelected ? 'ring-4 ring-brand-500 ring-offset-2 scale-105 z-10' : ''}`}
                      title={`${dayData.completionPercentage}% completed (${dayData.completedTasks}/${dayData.totalTasks})`}
                    >
                      <span className="font-semibold text-sm z-10 relative">
                        {dayNum}
                      </span>
                      {dayData.completionPercentage === 100 && dayData.totalTasks > 0 && (
                        <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-8 flex items-center justify-end gap-3 text-sm text-slate-500">
                <span>Less</span>
                <div className="flex gap-1.5">
                  <div className="w-4 h-4 rounded-sm bg-slate-50 border border-slate-200"></div>
                  <div className="w-4 h-4 rounded-sm bg-emerald-100 border border-emerald-200"></div>
                  <div className="w-4 h-4 rounded-sm bg-emerald-300 border border-emerald-400"></div>
                  <div className="w-4 h-4 rounded-sm bg-emerald-500 border border-emerald-600"></div>
                  <div className="w-4 h-4 rounded-sm bg-emerald-600 border border-emerald-700"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          )}
        </Card>

        <div className="lg:w-1/3 flex flex-col">
          <Card className="flex-1 sticky top-24 min-h-[400px]">
            <h3 className="text-lg font-semibold mb-6 text-slate-900 border-b border-slate-100 pb-4">Day Details</h3>
            
            {!selectedDay && !loadingDetails && (
              <div className="text-slate-400 text-center my-16 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm">Select a date on the calendar to view tasks.</p>
              </div>
            )}

            {loadingDetails && (
              <div className="my-16 space-y-4">
                 <Skeleton className="w-1/2 h-6 mb-8" />
                 <Skeleton className="w-full h-12" />
                 <Skeleton className="w-full h-12" />
                 <Skeleton className="w-full h-12" />
              </div>
            )}

            {dayDetails && !loadingDetails && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="font-semibold text-brand-600 text-lg mb-6">
                  {new Date(dayDetails.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                
                {dayDetails.tasks.length === 0 ? (
                  <div className="text-slate-500 bg-slate-50 p-6 rounded-xl border border-slate-100 text-center text-sm">
                    No tasks scheduled for this day.
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {dayDetails.tasks.map((task, idx) => (
                      <li key={idx} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${task.isCompleted ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-white ${task.isCompleted ? 'bg-emerald-500' : 'bg-slate-200 border border-slate-300'}`}>
                          {task.isCompleted && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <span className={`block font-medium truncate ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {task.taskName}
                          </span>
                        </div>
                        <span className="flex-shrink-0 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                          {task.time.substring(0,5)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
