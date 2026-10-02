const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeWithAI = async ({ equipment, issue, ruleResults, knowledge }) => {
  const prompt = `
You are an equipment maintenance triage assistant.

Your job is to help a technician investigate an equipment issue.

IMPORTANT RULES:
- Do not claim a cause is confirmed unless the provided evidence confirms it.
- Clearly separate observations from possible causes.
- Do not invent sensor readings.
- Do not invent manual sections or evidence.
- Use the provided knowledge base as the primary reference.
- Deterministic rule results are authoritative for threshold status.
- Do not remotely control equipment.
- Do not approve maintenance work.
- A technician must review and approve the final work order.

EQUIPMENT:
${JSON.stringify(equipment, null, 2)}

ISSUE:
${JSON.stringify(issue, null, 2)}

DETERMINISTIC RULE RESULTS:
${JSON.stringify(ruleResults, null, 2)}

KNOWLEDGE BASE:
${JSON.stringify(knowledge, null, 2)}

Return ONLY valid JSON in this exact structure:

{
  "observations": [],
  "possibleCauses": [],
  "confirmedFindings": [],
  "followUpQuestions": [],
  "inspectionSteps": [],
  "evidence": [],
  "workOrder": {
    "title": "",
    "description": "",
    "priority": ""
  }
}

For evidence, mention the actual knowledge-base filename and relevant section.
If something is not confirmed, keep confirmedFindings empty.
`;

  const response = await client.responses.create({
    model: "gpt-5",
    input: prompt,
  });

  const text = response.output_text;

  return JSON.parse(text);
};

module.exports = {
  analyzeWithAI,
};
