type UserAddiction = {
  addictionId: string;
  addictionName: string;
  startDate: string;
  lastRelapseDate: string;
  achievements: SobrietyAchievement[];
  nextAchievement: SobrietyAchievement;
  createdAt: string;
  updatedAt: string;
  aiNote: string;
};
