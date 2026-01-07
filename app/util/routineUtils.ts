import DayOfWeek from "@/types/dayOfWeek";

export const parseTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

export const getDayOfWeekIndex = (dayOfWeek: DayOfWeek): number => {
  switch (dayOfWeek) {
    case DayOfWeek.Monday:
      return 1;
    case DayOfWeek.Tuesday:
      return 2;
    case DayOfWeek.Wednesday:
      return 3;
    case DayOfWeek.Thursday:
      return 4;
    case DayOfWeek.Friday:
      return 5;
    case DayOfWeek.Saturday:
      return 6;
    case DayOfWeek.Sunday:
      return 7;
    default:
      throw new Error(`Invalid dayOfWeek: ${dayOfWeek}`);
  }
};
