<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";

  const dispatch = createEventDispatcher();

  export let id: string;
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
    <DropdownMenu.Group>
      <DropdownMenu.Label>Acciones</DropdownMenu.Label>
      <!-- <DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
        Copy payment ID
      </DropdownMenu.Item> -->
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item on:click={() => dispatch("update", { id })}
      >Actualizar</DropdownMenu.Item
    >
    <DropdownMenu.Item on:click={() => dispatch("delete", { id })}
      >Eliminar</DropdownMenu.Item
    >
  </DropdownMenu.Content>
</DropdownMenu.Root>
