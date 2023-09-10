<script>
  import logo from "../../../assets/logo.svg";
  import logoDark from "../../../assets/logo-dark.svg";
  import PageWrapper from "./PageWrapper.svelte";
  export let noBranding = false;

  export let title = "";
  export let description = "";
</script>

<PageWrapper class="bg-backgrund/80 flex justify-start items-center" center>
  <div
    class="container relative hidden h-[800px] min-w-[400px] w-[400px] max-w-[400px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0"
  >
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6">
        {#if !noBranding}
          <div class="flex justify-center space-y-2 text-center">
            <img class="w-20 dark:hidden" src={logoDark} alt="Alfagame Logo" />
            <img
              class="w-20 hidden dark:block"
              src={logo}
              alt="Alfagame Logo"
            />
          </div>
        {/if}

        <div class="flex flex-col space-y-2 text-center">
          {#if title}
            <h1 class="text-2xl font-semibold tracking-tight">{title}</h1>
          {/if}
          {#if description}
            <p class="text-sm text-muted-foreground">
              {description}
            </p>
          {/if}
        </div>
        <slot />
      </div>
    </div>
  </div>
</PageWrapper>
