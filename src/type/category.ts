export type Category =
  | "Frontend"
  | "Backend"
  | "Fullstack"
  | "Mobile"
  | "DevOps";
export type CategoryFilter = "All" | Category;

export const categoryFilters: string[] = [
  "All",
  "Fullstack",
  "Frontend",
  "Backend",
  "Mobile",
  "DevOps",
];

export const projectCategories: Category[] = [
  "Fullstack",
  "Frontend",
  "Backend",
  "Mobile",
  "DevOps",
];
