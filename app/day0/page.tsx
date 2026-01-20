import { FeedbackPage } from "@/components/task/feedback-page";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function Day0Page() {
  return <FeedbackPage dayNumber={0} />;
}
