<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  // import { Check } from "lucide-svelte";
  import { cn } from "$lib/utils";

  type $$Props = SelectPrimitive.ItemProps;
  type $$Events = SelectPrimitive.ItemEvents;

  let className: $$Props["class"] = undefined;
  export let value: $$Props["value"];
  export let label: $$Props["label"] = undefined;
  export let disabled: $$Props["disabled"] = undefined;
  export { className as class };
</script>

<SelectPrimitive.Item
  {value}
  {disabled}
  {label}
  class={cn(
    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )}
  {...$$restProps}
  on:click
  on:keydown
  on:focusin
  on:focusout
  on:pointerleave
  on:pointermove
>
  <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
    <SelectPrimitive.ItemIndicator>
      <span class="i-ph-check h-4 w-4" />
    </SelectPrimitive.ItemIndicator>
  </span>
  <slot />
</SelectPrimitive.Item>
