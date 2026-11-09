export const CATEGORIES = [
  "about",
  "personality",
  "web3",
  "lifestyle",
  "fun",
  "dreams",
  "community",
] as const;

export type QuestionCategory = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  about: "About Me",
  personality: "Personality",
  web3: "Web3 Life",
  lifestyle: "Lifestyle",
  fun: "Fun & Random",
  dreams: "Dreams & Ambitions",
  community: "AlphaGems Community",
};

export type ThemeId = "lavender" | "pop" | "crystal";

export type CaptionStyle = "cute" | "cool" | "funny";

export interface GemProfile {
  displayName: string;
  username: string;
  avatarUrl: string | null;
}

export interface GemQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  isActive: boolean;
}

export interface GemAnswer {
  questionId: string;
  question: string;
  category: QuestionCategory;
  answer: string;
}

export interface GemCard {
  id: string;
  profile: GemProfile;
  answers: GemAnswer[];
  theme: ThemeId;
  createdAt: string;
  seed: number;
}

export interface GemSession {
  version: 1;
  gemId: string;
  seed: number;
  profile: GemProfile;
  questions: GemQuestion[];
  answers: Record<string, string>;
  questionIndex: number;
  theme: ThemeId;
  captionStyle: CaptionStyle;
  captionOverride: string | null;
  createdAt: string;
  tracked: {
    profile?: boolean;
    questions?: boolean;
    card?: boolean;
    answered?: string[];
  };
}

export const ANALYTICS_EVENTS = [
  "landing_viewed",
  "create_started",
  "profile_completed",
  "question_answered",
  "questions_completed",
  "card_generated",
  "card_downloaded",
  "caption_copied",
  "x_share_clicked",
  "create_another_clicked",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsProps = Record<string, string | number | boolean>;
