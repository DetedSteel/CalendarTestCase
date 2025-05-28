import type { RemindersData, Reminder } from "./types";

export const transformReminders = (
  remindersData: RemindersData | undefined
): Record<string, Reminder[]> => {
  const result: Record<string, Reminder[]> = {};
  if (!remindersData) return {};
  Object.values(remindersData.reminders).forEach((reminder) => {
    const date = new Date(reminder.reminder_on_datetime);
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    if (!result[dateKey]) {
      result[dateKey] = [];
    }

    result[dateKey].push(reminder);
  });

  return result;
};

export const getFirstDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getLastDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getCalendarStartDate = (date: Date): Date => {
  const firstDayOfMonth = getFirstDayOfMonth(date);
  const dayOfWeek = firstDayOfMonth.getDay() || 7;

  const daysToSubtract = dayOfWeek - 1;
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - daysToSubtract);

  return startDate;
};

export const getCalendarEndDate = (date: Date): Date => {
  const lastDayOfMonth = getLastDayOfMonth(date);
  const dayOfWeek = lastDayOfMonth.getDay() || 7;

  const daysToAdd = 7 - dayOfWeek;
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + daysToAdd);

  return endDate;
};

export const generateCalendarDays = (date: Date): Date[] => {
  const startDate = getCalendarStartDate(date);
  const endDate = getCalendarEndDate(date);
  const days: Date[] = [];

  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

export const groupDaysByWeeks = (days: Date[]): Date[][] => {
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
};

export const isCurrentDay = (day: Date, currentDay: Date): boolean => {
  return (
    day.getDate() === currentDay.getDate() &&
    day.getMonth() === currentDay.getMonth() &&
    day.getFullYear() === currentDay.getFullYear()
  );
};

export const isCurrentMonth = (day: Date, currentDate: Date): boolean => {
  return day.getMonth() === currentDate.getMonth();
};

export const getEventsForDay = (
  day: Date,
  remindersByDate: Record<string, Reminder[]>
): Reminder[] => {
  const dateKey = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
  return remindersByDate[dateKey] || [];
};

export const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
