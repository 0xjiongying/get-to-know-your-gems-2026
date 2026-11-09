import type { Metadata } from "next";
import { ResultExperience } from "@/components/result/ResultExperience";

export const metadata: Metadata = {
  title: "Your Gem ID",
  description: "Download your card and share it with the AlphaGems community.",
};

export default function ResultPage() {
  return <ResultExperience />;
}
