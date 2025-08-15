# Multi Async example

<ClientOnly>
  <ReactAdaptater :component="MultiExample" />
</ClientOnly>

> 💡 **Explicit generic types are required**
>
> Since `<MeetingSelector />` is a generic component (with 4 generic parameters), you must **explicitly provide the generic arguments** (`DateFieldKey`, `MeetingSlotsKey`, `MSlot`, `MDay`) to avoid TypeScript inference issues — especially when using `multi={true}` or complex data shapes.
>
> Without these, TypeScript cannot infer the right slot or date keys, and you'll get type mismatches on `value`, `handleValueChange`, or `renderMeeting`.
>
> Here's how you should use it:
>
> ```tsx
> <MeetingSelector<'date', 'slots', MeetingSlotGenerated, MeetingsByDayGenerated>
>   value={value}
>   date={date}
>   skip={skip}
>   multi={true}
>   loading={loading}
>   handleValueChange={handleChange}
>   meetingsByDays={meetingsDays}
>   dateFieldKey="date"
>   meetingSlotsKey="slots"
>   handleNextDate={nextDate}
>   handlePreviousDate={previousDate}
>   handleSkipChange={setSkip}
> />
> ```
>
> Make sure `MeetingSlotGenerated` and `MeetingsByDayGenerated` are properly typed to match your data structure.

::: code-group

<<< ../.vitepress/components/react/SimpleAsyncExample.tsx

:::

<script setup lang="ts">
import ReactAdaptater from '../.vitepress/components/ReactAdaptater.vue'
import { MultiExample } from '../.vitepress/components/react/MultiExample.tsx'
</script>
