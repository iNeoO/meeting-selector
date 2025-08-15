# Events

This component emits several events related to date navigation and meeting slot selection.

## Event List

| Event Name          | Payload Type                              | Description                                                     |
| ------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| `next-date`         | —                                         | Emitted when the user moves to the next date view.              |
| `previous-date`     | —                                         | Emitted when the user moves to the previous date view.          |
| `update:skip`       | `(skip: number)`                          | Emitted when the `skip` value changes (e.g. pagination).        |
| `update:modelValue` | `(meetingSlot: MSlot \| MSlot[] \| null)` | Emitted when the selected meeting slot(s) change via `v-model`. |
| `change`            | `(meetingSlot: MSlot \| MSlot[] \| null)` | Emitted on selection change (manual or programmatic).           |

## Notes

- `update:modelValue` is part of the v-model contract and should be used to sync the selection externally.

- `change` is a convenience event for reacting to changes in selection, regardless of source.

- `next-date` and `previous-date` are useful for implementing pagination or custom date navigation controls.
