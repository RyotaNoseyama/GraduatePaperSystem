import { FeedbackPage } from "@/components/task/feedback-page";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function Day7Page() {
  return <FeedbackPage dayNumber={7} />;
}
