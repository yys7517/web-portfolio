import type { Category } from "./category";

export type SkillReason = {
  skillName: string;
  reason: string;
};

export type Project = {
  id: number;
  slug: string;
  title: string;
  role: string;
  duration: string;
  contribution: string;
  readmeMd: string;
  description: string;
  category: Category;
  tags: string[];
  image: string;
  demoUrl: string;
  githubUrl: string;
  skillReasons: SkillReason[];
};
