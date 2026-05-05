import React, { useEffect, useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isToday, parseISO } from 'date-fns';
import useTaskStore from '../store/useTaskStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const [current, setCurrent] = useState(new Date());

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const weekStart = startOfWeek(current, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(current, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const tasksForDay = (day) =>
    tasks.filter(t => {
      if (!t.dueDate) return false;
      const d = parseISO(t.dueDate);
      return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
    });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">Tasks organized by due date</p>
        </div>
        <div className="cal-controls">
          <button className="btn-icon" onClick={() => setCurrent(subWeeks(current, 1))}>
            <ChevronLeft size={20} />
          </button>
          <span className="cal-range">
            {format(weekStart, 'MMM d')} — {format(weekEnd, 'MMM d, yyyy')}
          </span>
          <button className="btn-icon" onClick={() => setCurrent(addWeeks(current, 1))}>
            <ChevronRight size={20} />
          </button>
          <button className="btn-ghost" onClick={() => setCurrent(new Date())}>Today</button>
        </div>
      </div>

      <div className="cal-grid">
        {days.map(day => {
          const dayTasks = tasksForDay(day);
          const todayClass = isToday(day) ? 'cal-day is-today' : 'cal-day';
          return (
            <div className={todayClass} key={day.toISOString()}>
              <div className="cal-day-header">
                <span className="cal-weekday">{format(day, 'EEE')}</span>
                <span className="cal-date">{format(day, 'd')}</span>
              </div>
              <div className="cal-day-body">
                {dayTasks.length === 0 ? (
                  <p className="cal-empty">Free</p>
                ) : (
                  dayTasks.map(t => (
                    <div key={t.id} className={`cal-task status-${t.status} pri-${t.priority} ${t.isCompleted ? 'is-done' : ''}`}>
                      <span className="cal-task-title">{t.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
