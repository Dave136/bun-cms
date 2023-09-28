<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";

  const dispatch = createEventDispatcher();

  export let cols: Record<string, string>[];
  export let hideable: string[];
  export let hideForId: Record<string, boolean>;
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="icon"
      class="relative w-8 h-8 p-0"
    >
      <span class="sr-only">Open menu</span>
      <div class="i-ph-dots-three-bold" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    {#each cols as col}
      {#if hideable.includes(col.id)}
        <DropdownMenu.CheckboxItem
          bind:checked={hideForId[col.id]}
          on:click={() =>
            dispatch("hide", {
              id: col.id,
              hide: hideForId[col.id],
            })}
        >
          {col.header}
        </DropdownMenu.CheckboxItem>
      {/if}
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
