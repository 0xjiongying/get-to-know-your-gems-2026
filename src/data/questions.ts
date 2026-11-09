import type { GemQuestion } from "@/types";

function q(
  id: string,
  category: GemQuestion["category"],
  question: string,
): GemQuestion {
  return { id, category, question, isActive: true };
}

export const QUESTIONS: GemQuestion[] = [
  q("about-1", "about", "What's one thing people don't know about you?"),
  q("about-2", "about", "What's your hidden talent?"),
  q("about-3", "about", "What's your current obsession?"),
  q("about-4", "about", "What's one word that describes you?"),
  q("about-5", "about", "What's your comfort activity?"),
  q("about-6", "about", "What are you quietly proud of?"),
  q("about-7", "about", "What's a small joy you protect?"),
  q("about-8", "about", "What did younger you think you'd be doing?"),

  q("personality-1", "personality", "Introvert or extrovert?"),
  q("personality-2", "personality", "What's your biggest green flag?"),
  q("personality-3", "personality", "What's your most unusual habit?"),
  q("personality-4", "personality", "What makes you instantly happy?"),
  q("personality-5", "personality", "Are you a planner or spontaneous?"),
  q("personality-6", "personality", "How do your friends describe you?"),
  q("personality-7", "personality", "What's your gentle toxic trait?"),
  q("personality-8", "personality", "What do people misunderstand about you?"),

  q("web3-1", "web3", "What brought you into Web3?"),
  q("web3-2", "web3", "Builder, researcher, or degen?"),
  q("web3-3", "web3", "What's your favorite ecosystem?"),
  q("web3-4", "web3", "What's your biggest Web3 lesson?"),
  q("web3-5", "web3", "What's your current Web3 obsession?"),
  q("web3-6", "web3", "What's a take you'd still defend?"),
  q("web3-7", "web3", "What do you actually do onchain?"),
  q("web3-8", "web3", "Which chain feels like home?"),

  q("lifestyle-1", "lifestyle", "Coffee or matcha?"),
  q("lifestyle-2", "lifestyle", "Cats or dogs?"),
  q("lifestyle-3", "lifestyle", "Morning person or night owl?"),
  q("lifestyle-4", "lifestyle", "What's your favorite comfort food?"),
  q("lifestyle-5", "lifestyle", "What's your ideal weekend?"),
  q("lifestyle-6", "lifestyle", "City, beach, or mountains?"),
  q("lifestyle-7", "lifestyle", "What's always in your bag?"),
  q("lifestyle-8", "lifestyle", "What's on repeat right now?"),

  q("fun-1", "fun", "If you were a gemstone, which one?"),
  q("fun-2", "fun", "What's your most-used emoji?"),
  q("fun-3", "fun", "What's your irrational fear?"),
  q("fun-4", "fun", "If you could teleport anywhere, where?"),
  q("fun-5", "fun", "What's your guilty pleasure?"),
  q("fun-6", "fun", "Sweet, salty, or both?"),
  q("fun-7", "fun", "What's a hill you'll die on?"),
  q("fun-8", "fun", "What would your meme name be?"),

  q("dreams-1", "dreams", "What's your biggest dream?"),
  q("dreams-2", "dreams", "What skill do you want to master?"),
  q("dreams-3", "dreams", "Where do you see yourself in five years?"),
  q("dreams-4", "dreams", "What's something you want to experience?"),
  q("dreams-5", "dreams", "What's your current life motto?"),
  q("dreams-6", "dreams", "What are you building toward?"),
  q("dreams-7", "dreams", "What's a promise you made to yourself?"),
  q("dreams-8", "dreams", "What does a good year look like?"),

  q("community-1", "community", "How did you discover AlphaGems?"),
  q("community-2", "community", "Describe AlphaGems in one word."),
  q("community-3", "community", "What's your favorite thing about this community?"),
  q("community-4", "community", "What would you like to learn from other Gems?"),
  q("community-5", "community", "Leave a message for the community."),
  q("community-6", "community", "What should a new Gem know first?"),
  q("community-7", "community", "Which kind of Gem are you becoming?"),
  q("community-8", "community", "What do you hope we make together?"),
];
