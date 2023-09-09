<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { Button } from "./ui/button";
  import toast from "svelte-french-toast";

  const dispatch = createEventDispatcher();

  export let codes = "";

  let element: HTMLAnchorElement;

  function handleDownload() {
    const fileContent = codes;
    const fileBlob = new Blob([fileContent], { type: "text/plain" });
    const fileURL = URL.createObjectURL(fileBlob);

    element.setAttribute("href", fileURL);
    element.click();
  }

  async function handleToCopy() {
    try {
      await navigator.clipboard.writeText(codes);
      toast.success("Se copió la información");
    } catch (error) {
      toast.error("Ocurrió un error al copiar la información");
    }
  }
</script>

<div class="border border-secondary p-8 rounded-md max-w-xl" transition:fade>
  <div class="w-full p-4 h-auto border border-secondary rounded-md">
    <p class="break-all whitespace-normal">{codes}</p>
  </div>

  <!-- svelte-ignore a11y-invalid-attribute -->
  <!-- svelte-ignore a11y-missing-content -->
  <a
    class="hidden"
    href="#"
    id="codeDownload"
    download="recovery-codes.txt"
    bind:this={element}
  />

  <div class="mt-8 flex gap-4 justify-between">
    <div class="">
      <Button variant="outline" on:click={handleDownload}>
        <span class="i-ph-download mr-2" />
        Descargar
      </Button>
      <Button variant="outline" on:click={handleToCopy}>
        <span class="i-ph-copy mr-2" />
        Copiar
      </Button>
    </div>
    <Button on:click={() => dispatch("continue")}>Continuar</Button>
  </div>
</div>
