import path from "path";
import { promises as fs } from "fs";
import websiteComponents, {
  WebsiteComponentEntry,
} from "@/data/website-components";
import intendedIssues from "@/data/intended_issues.json";

type IntendedIssuesRecord = Record<
  string,
  { visual_issue: string; functional_issue: string }
>;

const PROMPT_TEMPLATE_PATHS = {
  prompt: path.join(process.cwd(), "data", "prompt.md"),
  prompt2: path.join(process.cwd(), "data", "prompt2.md"),
} as const;

export type PromptTemplateName = keyof typeof PROMPT_TEMPLATE_PATHS;

const intendedIssuesMap = intendedIssues as IntendedIssuesRecord;
const templateCache: Partial<Record<PromptTemplateName, string>> = {};

const websiteComponentsByTaskNumber: Record<number, string[]> = (() => {
  const map: Record<number, string[]> = {};
  (websiteComponents as WebsiteComponentEntry[]).forEach((entry) => {
    const match = entry.page.match(/^day(\d+)$/);
    if (!match) {
      return;
    }

    const taskIndex = Number(match[1]);
    if (Number.isNaN(taskIndex)) {
      return;
    }

    map[taskIndex] = entry.components;
  });
  return map;
})();

async function loadPromptTemplate(
  templateName: PromptTemplateName = "prompt",
): Promise<string> {
  const cached = templateCache[templateName];
  if (cached) {
    return cached;
  }

  const template = await fs.readFile(
    PROMPT_TEMPLATE_PATHS[templateName],
    "utf-8",
  );
  templateCache[templateName] = template;
  return template;
}

function formatList(items: string[], fallback: string): string {
  if (!items.length) {
    return fallback;
  }

  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function getWebsiteComponents(taskNumber?: number | null): string[] {
  if (typeof taskNumber !== "number") {
    return [];
  }

  return websiteComponentsByTaskNumber[taskNumber] ?? [];
}

function getIntendedIssues(taskNumber?: number | null): string[] {
  if (typeof taskNumber !== "number") {
    return [];
  }

  const key = `day${taskNumber + 1}`;
  const issues = intendedIssuesMap[key];
  if (!issues) {
    return [];
  }

  return [issues.visual_issue, issues.functional_issue].filter(Boolean);
}

export async function buildEvaluationPrompt(params: {
  taskNumber?: number | null;
  workerAnswer: string;
  templateName?: PromptTemplateName;
}): Promise<string> {
  const template = await loadPromptTemplate(params.templateName ?? "prompt");
  const websiteComponentsList = getWebsiteComponents(params.taskNumber);
  const intendedIssuesList = getIntendedIssues(params.taskNumber);

  const websiteComponentsText = formatList(
    websiteComponentsList,
    "該当するUI構成情報が見つかりません。",
  );
  const intendedIssuesText = formatList(
    intendedIssuesList,
    "模範的な指摘リストは利用できません。",
  );
  const workerAnswerText =
    params.workerAnswer?.trim() || "（ワーカー回答が入力されていません）";

  return template
    .replaceAll("{website_components}", websiteComponentsText)
    .replaceAll("{intended_issues}", intendedIssuesText)
    .replaceAll("{worker_answer}", workerAnswerText);
}

export function getPromptTemplateForCond(
  cond?: number | null,
): PromptTemplateName {
  return cond === 2 ? "prompt2" : "prompt";
}
