import Gender from "@/types/gender";

export const GenderLabelMap: Record<Gender, string> = {
  [Gender.Male]: "Male",
  [Gender.Female]: "Female",
  [Gender.Other]: "Other",
  [Gender.Unknown]: "Unknown",
};

export const genderList = [
  { label: "Female", value: Gender.Female },
  { label: "Male", value: Gender.Male },
  { label: "Other", value: Gender.Other },
  { label: "Not Specified", value: Gender.Unknown },
];
