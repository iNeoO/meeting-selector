# Slots

The component exposes several slots to customize how buttons, headers, and meeting slots are rendered. All slots are typed and optional.

## Available Slots

| Slot Name         | Props Provided            | Description                                                                 |
| ----------------- | ------------------------- | --------------------------------------------------------------------------- |
| `meeting`         | `{ meeting: MSlot }`      | Renders a custom meeting slot. Use to customize the display of each slot.   |
| `header`          | `{ meetings: MDay }`      | Renders the header for each day group (e.g., day + month display).          |
| `button-previous` | `—`                       | Replaces the default "previous date" button.                                |
| `button-next`     | `—`                       | Replaces the default "next date" button.                                    |
| `button-up`       | `{ isDisabled: boolean }` | Replaces the default "previous meeting group" button (vertical navigation). |
| `button-down`     | `{ isDisabled: boolean }` | Replaces the default "next meeting group" button (vertical navigation).     |

## Example usage

```vue
<MeetingSelector v-slot:meeting="{ meeting }">
  <div class="custom-meeting">{{ meeting.startAt }}</div>
</MeetingSelector>

<MeetingSelector v-slot:header="{ meetings }">
  <h3>{{ new Date(meetings.date).toLocaleDateString() }}</h3>
</MeetingSelector>

<MeetingSelector>
  <template #button-previous>
    <MyCustomArrow direction="left" />
  </template>
</MeetingSelector>
```
