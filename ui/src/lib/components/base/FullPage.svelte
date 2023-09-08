<script>
  import PageWrapper from "./PageWrapper.svelte";
  export let noBranding = false;
</script>

<PageWrapper class="bg-backgrund/80" center>
  <div class="">
    {#if !noBranding}
      <p>Showing logo...</p>
    {/if}

    <slot />
  </div>
</PageWrapper>
