<script>
export default {
  name: "MixinCss",
};
</script>

<style>
/* Changes the mouse's cursor on Pointer */
.pointer {
  cursor: pointer;
}

/* Title */
h1,
h2 {
  color: #e9c490;
}

/* No underline effect for NuxtLink (does not work) */
NuxtLink {
  text-decoration: none;
}

/* Zoom effect when overing */
.zoom {
  transition: transform 0.2s;
}
.zoom:hover {
  transform: scale(1.2);
}
.zoom-sm {
  transition: transform 0.2s;
}
.zoom-sm:hover {
  transform: scale(1.1);
}
.zoom-xs {
  transition: transform 0.2s;
}
.zoom-xs:hover {
  transform: scale(1.05);
}
</style>
