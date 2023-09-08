<script lang="ts">
  export let center = false;

  let classes = "";
  export { classes as class };
</script>

<div
  class="flex flex-col flex-1 w-full overflow-x-hidden overflow-y-auto scrollbar-stable scroll-smoth {classes}"
>
  <main class={center ? "flex items-center" : ""}>
    <slot />
  </main>

  <footer
    class="flex gap-[5px] items-center text-right p-[0px_30px_15px] text-gray-500 text-sm"
  >
    &copy; all rights reserved - maded by <a
      href="https://github.com/Dave136"
      rel="noopener noreferrer"
      target="_blank">David</a
    >
  </footer>
</div>
