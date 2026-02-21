import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const QUALITY_GATE = `
---

SELF-CHECK (mandatory at end of every response):

Review your own response against these quality gates before finalizing:

- [ ] **Manual compliance**: Did I follow all rules from the matched manuals?
- [ ] **Error handling**: Is every async operation wrapped in try/catch?
- [ ] **Type safety**: No \`any\` types used without justification?
- [ ] **Security**: No SQL injection, XSS, or exposed secrets?
- [ ] **Validation**: Are all inputs validated at API boundaries?
- [ ] **Loading/Error states**: Are all async UI states handled?
- [ ] **MODIFIED_FILES logged**: Did I list all files I changed at the end?

At the end of your response, output:
QUALITY_GATE_RESULTS:
- Manual compliance: PASS/FAIL
- Error handling: PASS/FAIL
- Type safety: PASS/FAIL
- Security: PASS/FAIL
- Validation: PASS/FAIL
- Loading/Error states: PASS/FAIL (or N/A)
- MODIFIED_FILES logged: PASS/FAIL
`;

export async function sendToClaude(
  systemPrompt: string,
  userMessage: string,
  model = 'claude-sonnet-4-6'
): Promise<string> {
  const fullSystemPrompt = systemPrompt + QUALITY_GATE;

  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    system: fullSystemPrompt,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  const textBlock = message.content.find(block => block.type === 'text');
  return textBlock ? textBlock.text : '';
}

export function buildSystemPrompt(contextPrefix: string, memorySection: string): string {
  const parts: string[] = [
    'You are a senior software engineer. You write clean, typed, well-structured code.',
    'You follow the project manuals precisely. You never skip error handling.',
    'You always log MODIFIED_FILES at the end of your response.',
  ];

  if (contextPrefix) {
    parts.push('\n' + contextPrefix);
  }

  if (memorySection) {
    parts.push('\n' + memorySection);
  }

  return parts.join('\n\n');
}
