interface UserGoal {
  id: string;
  name: string;
  userId: number;
  progress: number;
  goal: number;
  progressInPercent: number;
  remainingProgress: number;
  isCompleted: boolean;
  progressUnitType: ProgressUnitType;
  progressUnit: string;
  createdDate: string;
  successTitle: string;
  successDescription: string;
}
