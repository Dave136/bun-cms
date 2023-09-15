<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  export let name = "";
</script>

<div class="grid grid-cols-4 items-center gap-4">
  <Label for="name" class="text-right">Nombre</Label>
  <Input id="name" bind:value={name} class="col-span-3" />
</div>
