import ReviewAskPage, { askMetadata } from "@/components/home/ReviewAskPage";

// rendered per request: a review the bot published a minute ago is found even before the site rebuilds
export const dynamic = "force-dynamic";
export const metadata = askMetadata("he");

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ReviewAskPage lang="he" params={params} />;
}
