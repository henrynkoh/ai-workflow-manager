# Quality Gate — Post-Task Reviewer Prompt

This prompt is automatically appended to every Claude response and triggers an auto-review.

---

## Reviewer Prompt (appended to system prompt)

```
SELF-CHECK (mandatory at end of every response):

Review your own response against these quality gates before finalizing:

- [ ] **Manual compliance**: Did I follow all rules from the matched manuals?
- [ ] **Error handling**: Is every async operation wrapped in try/catch?
- [ ] **Type safety**: No `any` types used without justification?
- [ ] **Security**: No SQL injection, XSS, or exposed secrets?
- [ ] **Validation**: Are all inputs validated at API boundaries?
- [ ] **Loading/Error states**: Are all async UI states handled?
- [ ] **MODIFIED_FILES logged**: Did I list all files I changed?

If any gate fails, fix the issue before outputting the final response.

At the end of your response, output the self-check results:
QUALITY_GATE_RESULTS:
- Manual compliance: PASS/FAIL
- Error handling: PASS/FAIL
- Type safety: PASS/FAIL
- Security: PASS/FAIL
- Validation: PASS/FAIL
- Loading/Error states: PASS/FAIL (N/A for backend tasks)
- MODIFIED_FILES logged: PASS/FAIL
```

---

## Auto-Trigger Review Prompt

After each Claude response, the UI sends this follow-up:

```
/review-last-response

The previous response has been recorded. Now act as a senior code reviewer.
Check the code in MODIFIED_FILES against the manual rules that were injected.

Flag any violations found. Output:
REVIEW_RESULTS:
[file]: [issue] → [suggested fix]

If no issues: REVIEW_RESULTS: CLEAN
```

---

## Notes
- The self-check is non-negotiable — it catches common mistakes before they land
- The auto-review adds a second pass from a "reviewer" perspective
- Both results are shown in the UI so the developer can see quality at a glance
