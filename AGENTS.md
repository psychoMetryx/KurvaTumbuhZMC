# Agent Guidelines

## Coding and style conventions
- Use TypeScript and React functional components; prefer hooks for state and effects.
- Keep utility functions pure and reusable; place shared math or formatting helpers in `utils/`.
- Favor Tailwind utility classes for styling; avoid inline style objects unless unavoidable.
- Organize imports in the order: core React, third-party libraries, absolute paths, then relative paths.
- Maintain clear naming for props and types; extend existing types in `types.ts` when adding new data models.

## Testing expectations
- Run `npm run build` before raising a PR to catch type or bundling issues.
- Document any manual verification steps performed for UI changes.

## PR messaging rules
- PR descriptions must contain **Summary** and **Testing** sections.
- List concise bullet points under each section; note any skipped or failing checks in Testing.
