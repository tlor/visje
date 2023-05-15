<script>
import { onMount } from "svelte";
export let value,
  placeholder = "Tags",
  classes = "form-control",
  tagClass = "badge-primary";

let tags = value;
onMount(() => {
  jQuery(_tagsInputElement).tagsinput({
    tagClass,
    classes,
  });
  jQuery(_tagsInputElement).on("itemAdded", function (event) {
    value = jQuery(_tagsInputElement).tagsinput("items");
  });
  jQuery(_tagsInputElement).on("itemRemoved", function (event) {
    value = jQuery(_tagsInputElement).tagsinput("items");
  });
});
let _tagsInputElement;

</script>

<input bind:this={_tagsInputElement} type="text" {placeholder} bind:value />
