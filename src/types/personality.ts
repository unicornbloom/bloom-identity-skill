/**
 * Personality Types for Bloom Identity Cards
 */

export enum PersonalityType {
  THE_VISIONARY = 'The Visionary',
  THE_EXPLORER = 'The Explorer',
  THE_CULTIVATOR = 'The Cultivator',
  THE_OPTIMIZER = 'The Optimizer',
  THE_INNOVATOR = 'The Innovator',
}

export interface IdentityData {
  personalityType: PersonalityType;
  customTagline: string;
  customDescription: string;
  mainCategories: string[];
  subCategories: string[];
}

export interface SkillRecommendation {
  skillId: string;
  skillName: string;
  description: string;
  url: string;
  categories: string[];
  matchScore: number;
  creator?: string;
  creatorUserId?: number;
}
