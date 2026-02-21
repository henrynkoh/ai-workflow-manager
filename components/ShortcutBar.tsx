'use client';

interface ShortcutBarProps {
  onShortcut: (template: string) => void;
}

const shortcuts = [
  {
    label: '/continue',
    description: 'Resume last task with full memory context',
    template: `/continue

Load my current project context from memory files and resume the next uncompleted task.

Before starting:
1. Confirm which task you're resuming
2. State what was done previously (from context notes)
3. State what you plan to do next

Then proceed with the implementation.`,
  },
  {
    label: '/plan',
    description: 'Get a structured implementation plan first',
    template: `/plan [describe your task here]

Before writing any code, create a detailed implementation plan including:
1. Goal and problem being solved
2. Files to create or modify
3. Dependencies needed
4. Numbered implementation steps (small, testable)
5. Edge cases and error handling approach
6. How to verify/test the result

Output the plan BEFORE writing any code.`,
  },
  {
    label: '/review',
    description: 'Review last response against manual rules',
    template: `/review

Review the code from the last task against all applicable manual rules.

Check for:
1. Correctness — does it do what was intended?
2. Manual compliance — backend, frontend, security, database, general rules
3. Edge cases — error states, empty states
4. Security — injection risks, exposed secrets, auth bypasses
5. Performance — obvious inefficiencies

Output PASS/FAIL for each check with specific issues and suggested fixes.`,
  },
  {
    label: '/add-rule',
    description: 'Add a new rule to a manual',
    template: `/add-rule [manual: backend|frontend|security|database|general]

Rule to add: [describe the rule here]

Format:
1. State the rule (imperative: "Always...", "Never...", "Use...")
2. Good example (// Good code block)
3. Bad example (// Bad code block)
4. Rationale in 1–2 sentences

Then update the appropriate manual file.`,
  },
];

export function ShortcutBar({ onShortcut }: ShortcutBarProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Shortcuts</h3>
      {shortcuts.map((s) => (
        <button
          key={s.label}
          onClick={() => onShortcut(s.template)}
          className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-colors group"
        >
          <div className="font-mono text-sm font-semibold text-blue-600 group-hover:text-blue-700">
            {s.label}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 leading-tight">{s.description}</div>
        </button>
      ))}
    </div>
  );
}
