import type { Metadata } from "next";
import { CreateFlow } from "@/components/create/CreateFlow";

export const metadata: Metadata = {
  title: "Create your Gem ID",
  description: "Answer five random questions and make your AlphaGems card.",
};

export default function CreatePage() {
  return <CreateFlow />;
}
