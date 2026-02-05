/**
 * Project Matcher - Hybrid Strategy
 *
 * Combines:
 * 1. Bloom Product Database (Product Hunt - Web2 + Web3)
 * 2. Curated Base Ecosystem projects (including x402, OpenClaw)
 * 3. Trending and featured projects
 */

import { PersonalityType } from '../skills/bloom-identity-skill';
import baseEcosystem from '../data/base-ecosystem.json';

export interface ProjectRecommendation {
  id: string;
  name: string;
  description: string;
  url: string;
  categories: string[];
  tags: string[];
  matchScore: number;
  source: 'bloom-database' | 'base-ecosystem';
  badges: string[];
  blockchain?: string;
  isWeb3?: boolean;
  featured?: boolean;
  trending?: boolean;
  relatedTo?: string[];
}

export class ProjectMatcherHybrid {
  private baseEcosystem: any[];

  constructor() {
    // Load curated Base ecosystem projects
    this.baseEcosystem = baseEcosystem;
  }

  /**
   * Find matching projects from both sources
   */
  async findMatches(
    subCategories: string[],
    personalityType: PersonalityType,
    options?: {
      limit?: number;
      prioritizeBase?: boolean;
      prioritizeFeatured?: boolean;
    }
  ): Promise<ProjectRecommendation[]> {
    const limit = options?.limit || 10;

    console.log(`🔍 Finding projects for ${personalityType}...`);
    console.log(`📊 Sub-categories: ${subCategories.join(', ')}`);

    // 1. Query Bloom Database (Product Hunt)
    const bloomProjects = await this.queryBloomDatabase({
      categories: subCategories,
      limit: 20, // Get more for better selection
    });

    // 2. Filter Base ecosystem projects
    const baseProjects = this.filterBaseProjects(subCategories, personalityType);

    // 3. Combine all projects
    const allProjects = [...bloomProjects, ...baseProjects];

    // 4. Score each project
    const scored = allProjects.map(project => ({
      ...project,
      matchScore: this.calculateMatchScore(project, subCategories, personalityType),
    }));

    // 5. Sort and balance results
    const balanced = this.balanceResults(scored, {
      limit,
      prioritizeBase: options?.prioritizeBase ?? true,
      prioritizeFeatured: options?.prioritizeFeatured ?? true,
    });

    console.log(`✅ Found ${balanced.length} matching projects`);

    return balanced;
  }

  /**
   * Query Bloom's Product Database (Product Hunt)
   */
  private async queryBloomDatabase(params: {
    categories: string[];
    limit: number;
  }): Promise<any[]> {
    // TODO: Integrate with Bloom's API
    // const response = await fetch('https://api.bloomprotocol.ai/projects', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     categories: params.categories,
    //     limit: params.limit,
    //   })
    // });
    // return await response.json();

    // For now, return mock Product Hunt data
    return this.getMockBloomProjects(params.categories);
  }

  /**
   * Filter Base ecosystem projects by categories and personality
   */
  private filterBaseProjects(
    subCategories: string[],
    personalityType: PersonalityType
  ): any[] {
    return this.baseEcosystem
      .filter(project => {
        // Filter by sub-categories
        const categoryMatch = project.tags.some((tag: string) =>
          subCategories.some(sub =>
            tag.toLowerCase().includes(sub.toLowerCase()) ||
            sub.toLowerCase().includes(tag.toLowerCase())
          )
        );

        // Filter by personality fit
        const personalityMatch =
          !project.personalityFit ||
          project.personalityFit.length === 0 ||
          project.personalityFit.includes(personalityType);

        return categoryMatch || personalityMatch;
      })
      .map(project => ({
        ...project,
        source: 'base-ecosystem' as const,
        badges: this.getProjectBadges(project),
      }));
  }

  /**
   * Calculate match score (0-100)
   */
  private calculateMatchScore(
    project: any,
    subCategories: string[],
    personalityType: PersonalityType
  ): number {
    let score = 0;

    // 1. Sub-category matching (40%)
    const matchedCategories = project.tags.filter((tag: string) =>
      subCategories.some(sub =>
        tag.toLowerCase().includes(sub.toLowerCase()) ||
        sub.toLowerCase().includes(tag.toLowerCase())
      )
    );
    const categoryScore = Math.min((matchedCategories.length / subCategories.length) * 40, 40);
    score += categoryScore;

    // 2. Personality alignment (30%)
    if (project.personalityFit?.includes(personalityType)) {
      score += 30;
    } else if (project.personalityFit && project.personalityFit.length > 0) {
      score += 15; // Partial match
    }

    // 3. Featured bonus (10%)
    if (project.featured) {
      score += 10;
    }

    // 4. Trending bonus (10%)
    if (project.trending) {
      score += 10;
    }

    // 5. Related to x402/OpenClaw bonus (10%)
    if (project.relatedTo?.includes('x402') || project.relatedTo?.includes('openclaw')) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Balance results: Mix Base + Bloom, prioritize featured/trending
   */
  private balanceResults(
    projects: any[],
    options: {
      limit: number;
      prioritizeBase: boolean;
      prioritizeFeatured: boolean;
    }
  ): ProjectRecommendation[] {
    // Sort by match score
    const sorted = projects.sort((a, b) => b.matchScore - a.matchScore);

    // Separate Base and Bloom projects
    const baseProjects = sorted.filter(p => p.source === 'base-ecosystem');
    const bloomProjects = sorted.filter(p => p.source === 'bloom-database');

    // Separate featured/trending
    const featured = sorted.filter(p => p.featured || p.trending);
    const regular = sorted.filter(p => !p.featured && !p.trending);

    const result: ProjectRecommendation[] = [];

    if (options.prioritizeFeatured) {
      // Strategy: Featured first, then by score
      result.push(...featured.slice(0, 3)); // Top 3 featured
      result.push(...regular.slice(0, options.limit - 3));
    } else if (options.prioritizeBase) {
      // Strategy: Mix Base and Bloom, ensure Base visibility
      // Take top 3 Base projects
      result.push(...baseProjects.slice(0, 3));
      // Fill rest with highest scoring from both
      const remaining = sorted.filter(p => !result.includes(p));
      result.push(...remaining.slice(0, options.limit - 3));
    } else {
      // Strategy: Pure score-based
      result.push(...sorted.slice(0, options.limit));
    }

    // Deduplicate and limit
    const unique = Array.from(new Map(result.map(p => [p.id, p])).values());
    return unique.slice(0, options.limit);
  }

  /**
   * Get badges for project display
   */
  private getProjectBadges(project: any): string[] {
    const badges: string[] = [];

    // Base ecosystem badge
    if (project.blockchain === 'Base') {
      badges.push('Built on Base ⛓️');
    }

    // Web3 badge
    if (project.isWeb3) {
      badges.push('Web3 🌐');
    }

    // Stage badges
    if (project.stage === 'early') {
      badges.push('Early Stage 🌱');
    }

    // Trending badge
    if (project.trending) {
      badges.push('Trending 🔥');
    }

    // Featured badge
    if (project.featured) {
      badges.push('Featured ⭐');
    }

    // Special badges for x402/OpenClaw
    if (project.relatedTo?.includes('x402')) {
      badges.push('x402 Integrated 💸');
    }
    if (project.relatedTo?.includes('openclaw')) {
      badges.push('OpenClaw Powered 🤖');
    }

    return badges;
  }

  /**
   * Mock Bloom Database projects (for development)
   */
  private getMockBloomProjects(categories: string[]): any[] {
    // Mock data representing Product Hunt projects
    const mockProjects = [
      {
        id: 'notion-ai',
        name: 'Notion AI',
        description: 'AI-powered workspace for notes, docs, and knowledge management',
        categories: ['Productivity', 'AI Tools'],
        tags: ['Note-taking', 'AI', 'Collaboration', 'Workspace'],
        url: 'https://notion.so',
        source: 'bloom-database',
        isWeb3: false,
      },
      {
        id: 'cursor-ai',
        name: 'Cursor',
        description: 'AI-first code editor. Write code with GPT-4.',
        categories: ['AI Tools', 'Productivity'],
        tags: ['AI Coding', 'Developer Tools', 'IDE', 'GPT-4'],
        url: 'https://cursor.sh',
        source: 'bloom-database',
        isWeb3: false,
        trending: true,
      },
      {
        id: 'perplexity',
        name: 'Perplexity AI',
        description: 'AI-powered search engine. Get answers with sources.',
        categories: ['AI Tools', 'Education'],
        tags: ['Search', 'AI', 'Research', 'Learning'],
        url: 'https://perplexity.ai',
        source: 'bloom-database',
        isWeb3: false,
        trending: true,
      },
      {
        id: 'linear',
        name: 'Linear',
        description: 'Issue tracking for software teams. Fast, beautiful, and powerful.',
        categories: ['Productivity'],
        tags: ['Project Management', 'Developer Tools', 'Team', 'Workflow'],
        url: 'https://linear.app',
        source: 'bloom-database',
        isWeb3: false,
      },
      {
        id: 'supabase',
        name: 'Supabase',
        description: 'Open source Firebase alternative. Build backends in minutes.',
        categories: ['Productivity'],
        tags: ['Backend', 'Database', 'Developer Tools', 'Open Source'],
        url: 'https://supabase.com',
        source: 'bloom-database',
        isWeb3: false,
      },
      {
        id: 'superhuman',
        name: 'Superhuman',
        description: 'The fastest email experience ever made. Fly through your inbox.',
        categories: ['Productivity'],
        tags: ['Email', 'Productivity', 'Communication', 'Workflow'],
        url: 'https://superhuman.com',
        source: 'bloom-database',
        isWeb3: false,
      },
      {
        id: 'calm',
        name: 'Calm',
        description: 'Meditation and sleep app. Reduce stress, sleep better.',
        categories: ['Wellness', 'Lifestyle'],
        tags: ['Meditation', 'Sleep', 'Mental Health', 'Mindfulness'],
        url: 'https://calm.com',
        source: 'bloom-database',
        isWeb3: false,
      },
      {
        id: 'headspace',
        name: 'Headspace',
        description: 'Mindfulness and meditation made simple. Better mental health.',
        categories: ['Wellness'],
        tags: ['Meditation', 'Mindfulness', 'Mental Health', 'Wellness'],
        url: 'https://headspace.com',
        source: 'bloom-database',
        isWeb3: false,
      },
      {
        id: 'duolingo',
        name: 'Duolingo',
        description: 'Learn languages for free. Fun, effective, and gamified.',
        categories: ['Education'],
        tags: ['Language Learning', 'Education', 'Gamification', 'Mobile'],
        url: 'https://duolingo.com',
        source: 'bloom-database',
        isWeb3: false,
      },
      {
        id: 'brilliant',
        name: 'Brilliant',
        description: 'Learn by doing. Master math, science, and computer science.',
        categories: ['Education'],
        tags: ['Learning', 'Math', 'Science', 'Interactive'],
        url: 'https://brilliant.org',
        source: 'bloom-database',
        isWeb3: false,
      },
    ];

    // Filter by categories
    return mockProjects
      .filter(project =>
        project.tags.some(tag =>
          categories.some(cat => tag.toLowerCase().includes(cat.toLowerCase()))
        )
      )
      .map(project => ({
        ...project,
        badges: this.getProjectBadges(project),
      }));
  }

  /**
   * Get featured projects (x402, OpenClaw, trending)
   */
  getFeaturedProjects(): any[] {
    return this.baseEcosystem.filter(
      project => project.featured || project.trending || project.relatedTo
    );
  }

  /**
   * Get projects related to x402/OpenClaw
   */
  getRelatedProjects(relatedTo: string[]): any[] {
    return this.baseEcosystem.filter(project =>
      relatedTo.some(relation => project.relatedTo?.includes(relation))
    );
  }
}
