<script>
  export let section = "";
</script>

<!-- create a breadcrumb component -->
<div class="flex gap-1 items-center">
  <div class="opacity-50 font-bold">Collections</div>
  <div class="i-ph-caret-light text-primary" />
  <div>{section}</div>
</div>
