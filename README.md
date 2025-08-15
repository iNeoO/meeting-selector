# Meeting-selector

This component is inspired from the meeting selector from [doctolib](https://www.doctolib.fr/medecin-generaliste/paris).

- [github](https://github.com/IneoO/meeting-selector)
- [doc](https://meeting-selector.tuturu.io)

## availables portages

- React 19.x: [react-meeting-selector](https://github.com/IneoO/meeting-selector/blob/master/packages/react-meeting-selector/README.md)
- Vue 3.x: [vue-meeting-selector](https://github.com/IneoO/meeting-selector/blob/master/packages/vue-meeting-selector/README.md)

## Project Setup

This project is a **pnpm-based monorepo** containing both Vue and React implementations of the `meeting-selector` component, along with documentation, playgrounds, and shared utilities.

To work on a specific part of the project:

### Development

```json
"scripts": {
  "dev:vue-meeting-selector": "pnpm --filter vue-meeting-selector dev & pnpm --filter vue-meeting-selector-dev dev",
  "dev:react-meeting-selector": "pnpm --filter react-meeting-selector dev & pnpm --filter react-meeting-selector-dev dev",
  "dev:docs": "pnpm --filter doc-meeting-selector docs:dev",
  "lint": "pnpm -r run lint"
}
```

### Build

```json
"scripts": {
  "build:vue-meeting-selector": "pnpm --filter vue-meeting-selector build",
  "build:react-meeting-selector": "pnpm --filter react-meeting-selector build",
  "build:docs": "pnpm --filter doc-meeting-selector docs:build"
}
```

### Monorepo Structure

```bash
├── packages/
│   ├── vue-meeting-selector/       # Vue 3 library (main export)
│   ├── react-meeting-selector/     # React library (main export)
│   └── common/                     # Shared types, utilities, and generators
│
├── dev/
│   ├── vue-meeting-selector-dev/   # Vue playground & testing components
│   └── react-meeting-selector-dev/ # React playground & testing components
│
├── docs/                           # VitePress documentation site
│
└── README.md
```

All packages are linked via `pnpm workspaces` and use local imports to share logic across Vue and React implementations
