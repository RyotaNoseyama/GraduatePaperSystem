import { FeedbackPage } from "@/components/task/feedback-page";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function Day3Page() {
  return <FeedbackPage dayNumber={3} />;
}
