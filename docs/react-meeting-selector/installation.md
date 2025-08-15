# Installation

::: code-group

```bash [npm]
npm install react-meeting-selector
```

```bash [pnpm]
pnpm add react-meeting-selector
```

```bash [yarn]
yarn add react-meeting-selector
```

:::

## Dependencies

- required: react >= 19.x

## Usage

In your component

```typescript
import { MeetingSelector } from 'react-meeting-selector';
import 'react-meeting-selector/style.css';
```

## Helpers

`react-meeting-selector` provides utilities to generate mock or structured data compatible with the component.

### `generateMeetingsByDays`

Generates meeting slots at regular intervals within a time range, grouped by day. Useful for testing or real-world slot generation.

```typescript
import { generateMeetingsByDays } from 'react-meeting-selector';
```

[Learn more about `generateMeetingsByDays`](/common-meeting-selector/generate-meetings-by-days.html)

### generatePlaceholder

Returns a placeholder structure compatible with the component's expected shape, typically used to show loading skeletons or empty calendars.

```typescript
import { generatePlaceholder } from 'react-meeting-selector';
```

[Learn more about `generatePlaceholder`](/common-meeting-selector/generate-placeholder.html)
