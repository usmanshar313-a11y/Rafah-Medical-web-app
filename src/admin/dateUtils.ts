import { Appointment } from '../types';

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'custom';

export interface DateWindow {
  preset: DateRangePreset;
  startDate: Date;
  endDate: Date;
  startDateStr: string; // YYYY-MM-DD
  endDateStr: string;   // YYYY-MM-DD
  label: string;
  formattedRangeStr: string;
  previousStartDate: Date;
  previousEndDate: Date;
  previousLabel: string;
}

export const PRESET_OPTIONS: { id: DateRangePreset; label: string; description?: string }[] = [
  { id: 'today', label: 'Today', description: 'Appointments for today' },
  { id: 'yesterday', label: 'Yesterday', description: 'Appointments from yesterday' },
  { id: 'last_7_days', label: 'Last 7 Days', description: 'Past 7 consecutive days' },
  { id: 'this_week', label: 'This Week', description: 'Current week (Mon - Sun)' },
  { id: 'last_week', label: 'Last Week', description: 'Previous calendar week' },
  { id: 'this_month', label: 'This Month', description: 'Current calendar month' },
  { id: 'last_month', label: 'Last Month', description: 'Previous calendar month' },
  { id: 'this_year', label: 'This Year', description: 'Current calendar year' },
  { id: 'custom', label: 'Custom Range', description: 'Specify custom start & end dates' },
];

export const toStartOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const toEndOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const parseAppointmentDate = (appt: Appointment): Date | null => {
  if (appt.preferredDate) {
    const d = new Date(appt.preferredDate);
    if (!Number.isNaN(d.getTime())) {
      return toStartOfDay(d);
    }
  }

  if (appt.createdAt) {
    const d = typeof appt.createdAt === 'string' ? new Date(appt.createdAt) : new Date(appt.createdAt as any);
    if (!Number.isNaN(d.getTime())) {
      return toStartOfDay(d);
    }
  }

  return null;
};

export const filterAppointmentsByDate = (
  appointments: Appointment[],
  startDate: Date,
  endDate: Date
): Appointment[] => {
  const startMs = toStartOfDay(startDate).getTime();
  const endMs = toEndOfDay(endDate).getTime();

  return appointments.filter((appt) => {
    const apptDate = parseAppointmentDate(appt);
    if (!apptDate) return false;
    const time = apptDate.getTime();
    return time >= startMs && time <= endMs;
  });
};

export const calculateDateWindow = (
  preset: DateRangePreset,
  customStartStr?: string,
  customEndStr?: string
): DateWindow => {
  const now = new Date();
  const today = toStartOfDay(now);

  let startDate = today;
  let endDate = toEndOfDay(now);
  let label = 'This Month';
  let previousStartDate = today;
  let previousEndDate = today;
  let previousLabel = 'Prior Period';

  switch (preset) {
    case 'today': {
      startDate = today;
      endDate = toEndOfDay(today);
      label = 'Today';
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      previousStartDate = toStartOfDay(yesterday);
      previousEndDate = toEndOfDay(yesterday);
      previousLabel = 'Yesterday';
      break;
    }

    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      startDate = toStartOfDay(yesterday);
      endDate = toEndOfDay(yesterday);
      label = 'Yesterday';

      const dayBefore = new Date(today);
      dayBefore.setDate(today.getDate() - 2);
      previousStartDate = toStartOfDay(dayBefore);
      previousEndDate = toEndOfDay(dayBefore);
      previousLabel = 'Day Before Yesterday';
      break;
    }

    case 'last_7_days': {
      const sixDaysAgo = new Date(today);
      sixDaysAgo.setDate(today.getDate() - 6);
      startDate = toStartOfDay(sixDaysAgo);
      endDate = toEndOfDay(today);
      label = 'Last 7 Days';

      const thirteenDaysAgo = new Date(today);
      thirteenDaysAgo.setDate(today.getDate() - 13);
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      previousStartDate = toStartOfDay(thirteenDaysAgo);
      previousEndDate = toEndOfDay(sevenDaysAgo);
      previousLabel = 'Prior 7 Days';
      break;
    }

    case 'this_week': {
      const dayOfWeek = today.getDay(); // 0 is Sunday
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      startDate = toStartOfDay(monday);
      endDate = toEndOfDay(sunday);
      label = 'This Week';

      const prevMonday = new Date(monday);
      prevMonday.setDate(monday.getDate() - 7);
      const prevSunday = new Date(sunday);
      prevSunday.setDate(sunday.getDate() - 7);

      previousStartDate = toStartOfDay(prevMonday);
      previousEndDate = toEndOfDay(prevSunday);
      previousLabel = 'Last Week';
      break;
    }

    case 'last_week': {
      const dayOfWeek = today.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const thisMonday = new Date(today);
      thisMonday.setDate(today.getDate() + diffToMonday);

      const lastMonday = new Date(thisMonday);
      lastMonday.setDate(thisMonday.getDate() - 7);
      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastMonday.getDate() + 6);

      startDate = toStartOfDay(lastMonday);
      endDate = toEndOfDay(lastSunday);
      label = 'Last Week';

      const priorMonday = new Date(lastMonday);
      priorMonday.setDate(lastMonday.getDate() - 7);
      const priorSunday = new Date(lastSunday);
      priorSunday.setDate(lastSunday.getDate() - 7);

      previousStartDate = toStartOfDay(priorMonday);
      previousEndDate = toEndOfDay(priorSunday);
      previousLabel = 'Prior Week';
      break;
    }

    case 'this_month': {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      startDate = toStartOfDay(monthStart);
      endDate = toEndOfDay(monthEnd);
      label = 'This Month';

      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

      previousStartDate = toStartOfDay(lastMonthStart);
      previousEndDate = toEndOfDay(lastMonthEnd);
      previousLabel = 'Last Month';
      break;
    }

    case 'last_month': {
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

      startDate = toStartOfDay(lastMonthStart);
      endDate = toEndOfDay(lastMonthEnd);
      label = 'Last Month';

      const priorMonthStart = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      const priorMonthEnd = new Date(today.getFullYear(), today.getMonth() - 1, 0);

      previousStartDate = toStartOfDay(priorMonthStart);
      previousEndDate = toEndOfDay(priorMonthEnd);
      previousLabel = 'Prior Month';
      break;
    }

    case 'this_year': {
      const yearStart = new Date(today.getFullYear(), 0, 1);
      const yearEnd = new Date(today.getFullYear(), 11, 31);

      startDate = toStartOfDay(yearStart);
      endDate = toEndOfDay(yearEnd);
      label = 'This Year';

      const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);

      previousStartDate = toStartOfDay(lastYearStart);
      previousEndDate = toEndOfDay(lastYearEnd);
      previousLabel = 'Last Year';
      break;
    }

    case 'custom': {
      const startCandidate = customStartStr ? new Date(customStartStr) : today;
      const endCandidate = customEndStr ? new Date(customEndStr) : today;

      const validStart = !Number.isNaN(startCandidate.getTime()) ? startCandidate : today;
      const validEnd = !Number.isNaN(endCandidate.getTime()) ? endCandidate : today;

      startDate = toStartOfDay(validStart <= validEnd ? validStart : validEnd);
      endDate = toEndOfDay(validEnd >= validStart ? validEnd : validStart);

      label = 'Custom Range';

      const durationMs = endDate.getTime() - startDate.getTime();
      previousEndDate = toEndOfDay(new Date(startDate.getTime() - 24 * 60 * 60 * 1000));
      previousStartDate = toStartOfDay(new Date(previousEndDate.getTime() - durationMs));
      previousLabel = 'Prior Range';
      break;
    }
  }

  const startDateStr = formatDateToYYYYMMDD(startDate);
  const endDateStr = formatDateToYYYYMMDD(endDate);

  let formattedRangeStr = '';
  if (startDateStr === endDateStr) {
    formattedRangeStr = formatDisplayDate(startDate);
  } else {
    formattedRangeStr = `${formatShortDate(startDate)} – ${formatDisplayDate(endDate)}`;
  }

  return {
    preset,
    startDate,
    endDate,
    startDateStr,
    endDateStr,
    label,
    formattedRangeStr,
    previousStartDate,
    previousEndDate,
    previousLabel,
  };
};
