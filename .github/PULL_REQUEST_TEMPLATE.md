## Summary

<!-- What changed and why. A reviewer should not need the diff to get the point. -->

Closes #

## Type

- [ ] Bug fix
- [ ] Skill or script behavior
- [ ] Docs
- [ ] Install / CI / packaging
- [ ] Breaking change (skill rename, router pick, install command)

## How to test

<!-- Commands and what you expect. -->

```bash
npm test
npm run validate
```

-

## Checklist

- [ ] Tests added or updated if behavior changed
- [ ] If `skills/` changed: `npm run sync-cursor-skills` (no diff under `.cursor/skills/`)
- [ ] README / AGENTS.md / SKILL.md updated if the public surface changed
