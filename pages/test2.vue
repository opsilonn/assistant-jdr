<template>
  <div id="app">
    <v-container fluid class="wrapper">
      <v-row>
        <v-col>
          <div class="list">
            <drag v-for="n in items1" :data="n" class="item" :key="n">
              {{ n }}
            </drag>
          </div>
        </v-col>

        <v-col>
          <DropList
            :items="items2"
            class="list"
            @insert="onInsert"
            @reorder="$event.apply(items2)"
          >
            <template v-slot:item="{ item }">
              <drag class="item" :key="item">{{ item }}</drag>
            </template>

            <template v-slot:feedback="{ data }">
              <div class="item feedback" :key="data">feed {{ data }} back</div>
            </template>
          </DropList>
        </v-col>
      </v-row>
    </v-container>

    <v-row>
      <v-col>
        <v-treeview
          :items="audioFolder1"
          hoverable
          open-on-click
          shaped
          return-object
        >
          <!-- Label -->
          <template v-slot:label="{ item }">
            <drag :key="item.id" :data="item.id" @cut="remove(n)" go-back>
              <div class="pa-4">
                <span v-if="item.surname">
                  {{ item.surname }} <br />
                  <span class="font-italic">{{ item.name }}</span>
                </span>
                <span v-else>
                  {{ item.name }}
                </span>
              </div>
            </drag>
          </template>
        </v-treeview>
      </v-col>

      <v-col>
        <v-treeview
          :items="audioFolder2"
          hoverable
          open-on-click
          shaped
          return-object
        >
          <!-- Label -->
          <template v-slot:label="{ item }">
            <drop class="cut" @drop="onCutDrop" mode="cut">
              <drag :key="item.id" :data="item" @cut="remove(item)" go-back>
                <div class="pa-4">
                  <span v-if="item.surname">
                    {{ item.surname }} <br />
                    <span class="font-italic">{{ item.name }}</span>
                  </span>
                  <span v-else>
                    {{ item.name }}
                  </span>
                </div>
              </drag>
            </drop>
          </template>
        </v-treeview>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { Drag, Drop, DropList, DropMask, DragAwareMixin } from "vue-easy-dnd";

export default {
  name: "Azerty",

  mixins: [DragAwareMixin],

  components: {
    Drag,
    Drop,
    DropList,
    DropMask,
  },

  data: () => ({
    items1: ["1", "2", "3", "4", "5"],
    items2: ["a", "b", "c", "d", "e"],
    audioFolder1: [
      {
        id: 1,
        name: "Applications",
        children: [
          { id: 2, name: "Calendar" },
          { id: 3, name: "Chrome" },
          { id: 4, name: "Webstorm" },
        ],
      },
      {
        id: 5,
        name: "Documents",
        children: [
          {
            id: 6,
            name: "vuetify",
            children: [
              {
                id: 7,
                name: "src",
                children: [
                  { id: 8, name: "index" },
                  { id: 9, name: "bootstrap" },
                ],
              },
            ],
          },
          {
            id: 10,
            name: "material2",
            children: [
              {
                id: 11,
                name: "src",
                children: [
                  { id: 12, name: "v-btn" },
                  { id: 13, name: "v-card" },
                  { id: 14, name: "v-window" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 15,
        name: "Downloads",
        children: [
          { id: 16, name: "October" },
          { id: 17, name: "November" },
          { id: 18, name: "Tutorial" },
        ],
      },
      {
        id: 19,
        name: "Videos",
        children: [
          {
            id: 20,
            name: "Tutorials",
            children: [
              { id: 21, name: "Basic layouts" },
              { id: 22, name: "Advanced techniques" },
              { id: 23, name: "All about app" },
            ],
          },
          { id: 24, name: "Intro" },
          { id: 25, name: "Conference introduction" },
        ],
      },
    ],
    audioFolder2: [
      {
        id: 1,
        name: "Applications",
        children: [
          { id: 2, name: "Calendar" },
          { id: 3, name: "Chrome" },
          { id: 4, name: "Webstorm" },
        ],
      },
      {
        id: 5,
        name: "Documents",
        children: [
          {
            id: 6,
            name: "vuetify",
            children: [
              {
                id: 7,
                name: "src",
                children: [
                  { id: 8, name: "index" },
                  { id: 9, name: "bootstrap" },
                ],
              },
            ],
          },
          {
            id: 10,
            name: "material2",
            children: [
              {
                id: 11,
                name: "src",
                children: [
                  { id: 12, name: "v-btn" },
                  { id: 13, name: "v-card" },
                  { id: 14, name: "v-window" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 15,
        name: "Downloads",
        children: [
          { id: 16, name: "October" },
          { id: 17, name: "November" },
          { id: 18, name: "Tutorial" },
        ],
      },
      {
        id: 19,
        name: "Videos",
        children: [
          {
            id: 20,
            name: "Tutorials",
            children: [
              { id: 21, name: "Basic layouts" },
              { id: 22, name: "Advanced techniques" },
              { id: 23, name: "All about app" },
            ],
          },
          { id: 24, name: "Intro" },
          { id: 25, name: "Conference introduction" },
        ],
      },
    ],
  }),

  methods: {
    onInsert(event) {
      this.items2.splice(event.index, 0, event.data);
    },

    onCutDrop(event) {
      console.log("onCutDrop", event);
    },

    remove(event) {
      console.log("remove", event);
    },
  },
};
</script>

<style lang="scss">
html,
body,
#app,
.v-application--wrap,
.v-content,
.v-content__wrap {
  height: 100%;
}

.drop-in {
  box-shadow: 0 0 10px rgba(0, 0, 255, 0.3);
}
</style>

<style scoped lang="scss">
.wrapper {
  .list {
    border: 1px solid black;
    margin: 100px auto;
    width: 200px;

    .item {
      padding: 20px;
      margin: 10px;
      background-color: rgb(220, 220, 255);
      display: flex;
      align-items: center;
      justify-content: center;

      &.feedback {
        background-color: rgb(255, 220, 220);
        border: 2px dashed black;
      }

      &.drag-image {
        background-color: rgb(220, 255, 220);
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
