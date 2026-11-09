import type { Metadata } from "next";
import { CreateFlow } from "@/components/create/CreateFlow";

export const metadata: Metadata = {
  title: "Five questions",
  description: "Answer five random questions for your AlphaGems card.",
};

export default function QuestionsPage() {
  return <CreateFlow />;
}
