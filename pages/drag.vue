<template>
  <v-container>
    <div id="theDiv" class="theDiv"></div>
  </v-container>
</template>

<script>
// Imports

export default {
  name: "PageDrag",
  transition: "slide-bottom",

  data: () => ({
    dragValue: null,
  }),

  mounted() {
    this.move();
    document.onmouseup = () => (this.dragValue = null);
    document.onmousemove = (e) => {
      if (this.dragValue) {
        console.log(this.dragValue.style);
        this.dragValue.style.left =
          e.pageX + this.dragValue.style.height / 2 + "px";
        this.dragValue.style.top =
          e.pageY + this.dragValue.style.width / 2 + "px";
      }
    };
  },

  methods: {
    move(id) {
      var element = document.getElementById("theDiv");
      element.style.position = "absolute";
      element.onmousedown = () => (this.dragValue = element);
    },
  },

  head() {
    return { title: "" };
  },
};
</script>

<style>
.theDiv {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: black;
}
</style>
