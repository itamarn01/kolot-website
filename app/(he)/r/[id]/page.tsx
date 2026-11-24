import ReviewAskPage, { askMetadata, askParams } from "@/components/home/ReviewAskPage";

export const dynamicParams = false;
export const generateStaticParams = askParams;
export const metadata = askMetadata("he");

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ReviewAskPage lang="he" params={params} />;
}
