<template>
  <div>
    <v-row>
      <v-col>
        <div class="scroll">
          <h3 v-for="n in 40" :key="n">hello {{ n }}</h3>
        </div>
      </v-col>

      <v-col>
        <div class="scroll">
          <h3 v-for="n in 40" :key="n">goodbye {{ n }}</h3>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Test1",
};
</script>

<style scoped>
.scroll {
  height: 750px;
  overflow: scroll;
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
/* Hide scrollbar for Chrome, Safari and Opera */
.scroll::-webkit-scrollbar {
  display: none;
}
</style>
