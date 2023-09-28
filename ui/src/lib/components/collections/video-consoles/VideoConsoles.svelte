<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { loadVideoConsoles, videoConsole } from "$lib/store/video-consoles";
  import { createEventDispatcher, onMount } from "svelte";
  import { writable } from "svelte/store";
  import DataTable from "../DataTable.svelte";

  const dispatch = createEventDispatcher();

  let filterValue = writable("");

  onMount(async () => {
    try {
      await loadVideoConsoles();
    } catch (error) {
      console.error(error);
    }
  });
</script>

<div class="w-full">
  <div class="flex items-center py-4 justify-between">
    <Input
      class="max-w-sm"
      placeholder="Filtrar..."
      type="text"
      bind:value={$filterValue}
      disabled={!$videoConsole.length}
    />
    <div class="flex items-center gap-4">
      <Button variant="secondary" on:click={() => dispatch("add")}>
        <div class="i-ph-plus mr-2" />
        Agregar
      </Button>
    </div>
  </div>
  {#if $videoConsole.length}
    <DataTable />
  {:else}
    <div class="text-center mt-8">
      <p>No hay registros</p>
    </div>
  {/if}
</div>
