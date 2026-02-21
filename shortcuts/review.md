# /review — Code Review

Use this shortcut to get a thorough review of code that was just written.

---

## Template

```
/review

Review the code changes from the last task against all applicable manual rules.

Code to review:
[PASTE CODE HERE or reference MODIFIED_FILES from last response]

Check for:
1. **Correctness** — Does it do what was intended?
2. **Manual compliance** — Does it follow the rules in the matched manuals?
   - Backend: consistent response shape, error handling, status codes
   - Frontend: typed props, loading/error states, small components
   - Security: no injection vulnerabilities, proper auth checks
   - Database: paginated queries, no N+1, proper indexes
   - General: naming conventions, commit message format
3. **Edge cases** — Are error states handled? What about empty states?
4. **Security** — Any injection risks, exposed secrets, or auth bypasses?
5. **Performance** — Any obvious inefficiencies?
6. **Missing tests** — What should be tested?

Output:
- PASS or FAIL for each check
- Specific line references for issues found
- Suggested fixes for each issue
- Overall verdict: APPROVED / NEEDS CHANGES

After review, update memory/context-notes.md with key findings.
```

---

## When to Use
- After completing any implementation task
- Before submitting a PR
- When unsure about code quality

## Notes
- This is the "quality gate" — don't skip it
- Failed review items should be fixed before moving on
