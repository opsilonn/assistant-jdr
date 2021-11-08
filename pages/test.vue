<template>
  <v-container>
    <v-list>
      <template>
        <v-list-item v-for="(item, i) in list.data" :key="i">
          <v-list-item-content>
            <v-list-item-title>
              {{ item.bool ? item.val : "not authorized" }}
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon
              v-text="item.bool ? 'mdi-cancel' : 'mdi-pencil'"
              @click="item.bool = !item.bool"
            />
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
  </v-container>
</template>

<script>
// Imports

export default {
  name: "PageTemplate",
  transition: "slide-bottom",

  data: () => ({
    list: {
      data: [
        { val: "alpha", bool: true },
        { val: "beta", bool: false },
        { val: "gamma", bool: true },
        { val: "omega", bool: false },
      ],
    },
  }),

  computed: {},

  watch: {},

  mounted() {},

  methods: {},

  head() {
    return { title: "test" };
  },
};
</script>
