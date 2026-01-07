import DurationUnit from "@/types/durationUnit";
import {
  addYears,
  addMonths,
  addWeeks,
  addDays,
  addHours,
  addMinutes,
} from "date-fns";

export function getDuration(lastRelapseDate: Date) {
  const now = new Date();
  const difference = now.getTime() - lastRelapseDate.getTime();

  const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(
    (difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
  );
  const weeks = Math.floor(
    (difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7)
  );
  const days = Math.floor(
    (difference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24)
  );
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { years, months, weeks, days, hours, minutes, seconds };
}

export function getProgress({
  nextAchievement,
  lastRelapseDate,
}: {
  nextAchievement: SobrietyAchievement;
  lastRelapseDate: Date;
}) {
  const getAchievementDay = () => {
    if (nextAchievement.durationType === DurationUnit.Year) {
      return addYears(lastRelapseDate, nextAchievement.duration);
    } else if (nextAchievement.durationType === DurationUnit.Month) {
      return addMonths(lastRelapseDate, nextAchievement.duration);
    } else if (nextAchievement.durationType === DurationUnit.Week) {
      return addWeeks(lastRelapseDate, nextAchievement.duration);
    } else if (nextAchievement.durationType === DurationUnit.Day) {
      return addDays(lastRelapseDate, nextAchievement.duration);
    } else if (nextAchievement.durationType === DurationUnit.Hour) {
      return addHours(lastRelapseDate, nextAchievement.duration);
    } else if (nextAchievement.durationType === DurationUnit.Minute) {
      return addMinutes(lastRelapseDate, nextAchievement.duration);
    } else {
      throw new Error("Unsupported duration type");
    }
  };

  const achievementDate = getAchievementDay();
  const now = new Date();
  const totalDuration = achievementDate.getTime() - lastRelapseDate.getTime();

  const elapsedDuration = now.getTime() - lastRelapseDate.getTime();

  const progressPercentage = (elapsedDuration / totalDuration) * 100;

  return progressPercentage;
}

export function getNextObjectiveText(
  nextAchievement: SobrietyAchievement,
  language: string,
  translation: (value: string) => string
) {
  const durationUnitText = () => {
    if (nextAchievement.duration > 1) {
      return nextAchievement.durationType.toLowerCase() + "s";
    }
    return nextAchievement.durationType.toLowerCase();
  };

  if (language === "tr-TR") {
    return `${nextAchievement.duration} ${translation(
      `time.${nextAchievement.durationType}`
    )}`;
  }

  return `${nextAchievement.duration} ${durationUnitText()}`;
}
