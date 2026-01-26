import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupInfo } from "@/lib/group-utils";

interface InstructionsProps {
  groupInfo?: GroupInfo | null;
}

export function Instructions({ groupInfo }: InstructionsProps) {
  return (
    <Card className="mb-6 border-slate-200 bg-slate-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Task Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-slate-700 leading-relaxed">
        {/* <section className="space-y-2">
          <h4 className="font-semibold text-slate-900">Overview</h4>
          <p>
            Act as a professional <strong>UI/UX Consultant</strong>. Interact
            with the displayed website, identify issues, and report{" "}
            <em>Concrete Improvements</em>
            and <em>User Psychology</em>.
          </p>
        </section> */}

        {/* 回答が良かったら、報酬がさらに多いタスクに招待されますというセンテンスを追加 */}
        {/* <section className="space-y-2">
          <h4 className="font-semibold text-slate-900">Rewards</h4>
          <p>
            If your review is particularly insightful and helpful, you may be
            invited to participate in tasks with higher rewards.
          </p>
        </section> */}

        <section className="space-y-2">
          <h4 className="font-semibold text-slate-900">Schedule</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Tasks will be published daily from{" "}
              <strong>5 AM to 5 PM (UTC)</strong>.
            </li>
            <li>
              A new task will be released every day for the next
              <strong> 7 days </strong>.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h4 className="font-semibold text-slate-900">Instructions</h4>
          <div className="space-y-2">
            <h5 className="font-medium text-slate-900">
              Interact with the Website
            </h5>
            <p>
              Click buttons and type text to navigate the site. Find specific
              points where users might struggle or get frustrated.
            </p>
            <p>
              Your report will be evaluated on both its theoretical reasoning
              and the emotional insight it demonstrates.
            </p>
          </div>

          {/* <div className="space-y-2">
            <h5 className="font-medium text-slate-900">Submit Your Report</h5>
            <p>Please provide the following two points:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Improvement (Theory):</strong> Specifically what and how
                to fix.
                <span className="block text-sm text-slate-600">
                  e.g., "Change text color to black (#000)", "Move the button to
                  the top".
                </span>
              </li>
              <li>
                <strong>User Insight:</strong> In what situation and how would
                the user feel?
                <span className="block text-sm text-slate-600">
                  e.g., "If this error occurs while in a rush, the user would
                  panic".
                </span>
              </li>
            </ol>
          </div> */}
        </section>

        <section className="space-y-2">
          <h4 className="font-semibold text-slate-900">Important Notes</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>
                AI-generated text and copy-pasting are strictly prohibited.
              </strong>
              Detected cases will be rejected, and you will be blocked from
              future tasks.
            </li>
            <li>
              <strong>Contradictory or meaningless feedback</strong> will result
              in rejection.
            </li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
