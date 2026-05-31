import { createServerFn } from "@tanstack/react-start";

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

async function callAI(messages: ChatMsg[], model = "google/gemini-3-flash-preview") {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add funds in Settings → Workspace → Usage.");
    const t = await res.text();
    console.error("AI gateway error", res.status, t);
    throw new Error("AI gateway error");
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

// Generic chat for the Twin
export const twinChat = createServerFn({ method: "POST" })
  .inputValidator((data: { history: ChatMsg[]; message: string }) => data)
  .handler(async ({ data }) => {
    const reply = await callAI([
      {
        role: "system",
        content:
          "You are Career Twin, a sharp, concise AI career strategist embedded in CareerOS. Speak like a senior recruiter + staff engineer mentor. Use short paragraphs, bullets, and concrete numbers when relevant. Reference modules (Hiring Panel, Skill Gap, Mock Interview, Project Engine, Readiness Score) when useful.",
      },
      ...data.history,
      { role: "user", content: data.message },
    ]);
    return { reply };
  });

// Multi-agent hiring panel
export const hiringPanelReview = createServerFn({ method: "POST" })
  .inputValidator((d: { resume: string; jobDescription: string }) => d)
  .handler(async ({ data }) => {
    const prompt = `Resume:\n${data.resume}\n\nJob Description:\n${data.jobDescription}\n\nReturn ONLY valid JSON matching this TypeScript type, no prose, no markdown fences:\n{ "verdicts": [ { "role": "Recruiter"|"Hiring Manager"|"Tech Lead"|"Bar Raiser", "score": number (0-10), "verdict": "ADVANCE"|"HOLD"|"REJECT", "summary": string, "strengths": string[], "concerns": string[] } ], "panelDecision": "ADVANCE"|"HOLD"|"REJECT", "rationale": string }`;
    const raw = await callAI([
      { role: "system", content: "You simulate a 4-person hiring panel. Output strict JSON only." },
      { role: "user", content: prompt },
    ]);
    return parseJSON(raw);
  });

export const hiringProbability = createServerFn({ method: "POST" })
  .inputValidator((d: { resume: string; targetRole: string; company: string }) => d)
  .handler(async ({ data }) => {
    const raw = await callAI([
      { role: "system", content: "You estimate realistic hiring probability. Output strict JSON only, no markdown fences." },
      {
        role: "user",
        content: `Estimate hiring chance for target role "${data.targetRole}" at "${data.company}".\nResume:\n${data.resume}\n\nReturn JSON: { "probability": number (0-100), "tier": "Long Shot"|"Possible"|"Strong"|"Lock", "drivers": string[], "blockers": string[], "rejectionReasons": string[], "nextActions": string[] }`,
      },
    ]);
    return parseJSON(raw);
  });

export const skillGap = createServerFn({ method: "POST" })
  .inputValidator((d: { currentSkills: string; targetRole: string }) => d)
  .handler(async ({ data }) => {
    const raw = await callAI([
      { role: "system", content: "You build personalized learning roadmaps. Output strict JSON only." },
      {
        role: "user",
        content: `Current skills:\n${data.currentSkills}\n\nTarget role: ${data.targetRole}\n\nReturn JSON: { "gaps": [ { "skill": string, "currentLevel": number (0-100), "requiredLevel": number (0-100), "priority": "High"|"Medium"|"Low" } ], "roadmap": [ { "week": number, "focus": string, "resources": string[], "milestone": string } ] }`,
      },
    ]);
    return parseJSON(raw);
  });

export const mockInterview = createServerFn({ method: "POST" })
  .inputValidator((d: { role: string; question?: string; answer?: string; phase: "start" | "answer" }) => d)
  .handler(async ({ data }) => {
    if (data.phase === "start") {
      const raw = await callAI([
        { role: "system", content: "You are a Tier 1 tech interviewer. Output strict JSON only." },
        {
          role: "user",
          content: `Generate ONE challenging interview question for a ${data.role}. Return JSON: { "question": string, "category": "Behavioral"|"System Design"|"Coding"|"Domain" }`,
        },
      ]);
      return parseJSON(raw);
    }
    const raw = await callAI([
      { role: "system", content: "You evaluate interview answers like a staff engineer. Output strict JSON only." },
      {
        role: "user",
        content: `Role: ${data.role}\nQuestion: ${data.question}\nCandidate answer: ${data.answer}\n\nReturn JSON: { "score": number (0-10), "strengths": string[], "improvements": string[], "modelAnswer": string, "followUp": string }`,
      },
    ]);
    return parseJSON(raw);
  });

export const projectRecs = createServerFn({ method: "POST" })
  .inputValidator((d: { targetRole: string; skills: string }) => d)
  .handler(async ({ data }) => {
    const raw = await callAI([
      { role: "system", content: "You recommend portfolio projects hiring managers actually care about. Output strict JSON only." },
      {
        role: "user",
        content: `Target role: ${data.targetRole}\nCurrent skills: ${data.skills}\n\nReturn JSON: { "projects": [ { "title": string, "summary": string, "stack": string[], "difficulty": "Beginner"|"Intermediate"|"Advanced", "timeWeeks": number, "skillsBuilt": string[], "wowFactor": string } ] }`,
      },
    ]);
    return parseJSON(raw);
  });

export const readinessScore = createServerFn({ method: "POST" })
  .inputValidator((d: { resume: string; targetRole: string }) => d)
  .handler(async ({ data }) => {
    const raw = await callAI([
      { role: "system", content: "You compute job readiness across multiple axes. Output strict JSON only." },
      {
        role: "user",
        content: `Resume:\n${data.resume}\nTarget role: ${data.targetRole}\n\nReturn JSON: { "overall": number (0-10), "axes": [ { "name": "Technical"|"Communication"|"Portfolio"|"Experience"|"Culture Fit"|"Interview", "score": number (0-10), "note": string } ], "verdict": string, "topMoves": string[] }`,
      },
    ]);
    return parseJSON(raw);
  });

function parseJSON(raw: string): any {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {}
    }
    throw new Error("AI returned malformed output. Try again.");
  }
}
