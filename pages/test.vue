<template>
  <div>
    <v-row>
      <v-col>
        <v-treeview :items="audioFolder1" activatable transition>
          <template v-slot:label="{ item }">
            <draggable
              :list="audioFolder1"
              group="node"
              :id="item.id"
              @end="checkEnd"
            >
              <label>
                <i class="fas fa-user mr-3" />
                <span id="item.id">{{ item.name }}</span>
              </label>
            </draggable>
          </template>
        </v-treeview>
      </v-col>

      <v-col>
        <v-treeview :items="audioFolder2" activatable transition>
          <template v-slot:label="{ item }">
            <draggable
              :list="audioFolder2"
              group="node"
              :id="item.id"
              @end="checkEnd"
            >
              <label>
                <i class="fas fa-user mr-3" />
                <span id="item.id">{{ item.name }}</span>
              </label>
            </draggable>
          </template>
        </v-treeview>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "Test1",

  components: {
    draggable,
  },
  data: () => ({
    audioFolder1: [],
    audioFolder2: [],
  }),

  mounted() {
    const data = [
      {
        id: "1",
        name: "Applications",
        children: [
          { id: "2", name: "Calendar" },
          { id: "3", name: "Chrome" },
          { id: "4", name: "Webstorm" },
        ],
      },
      {
        id: "5",
        name: "Documents",
        children: [
          {
            id: "6",
            name: "vuetify",
            children: [
              {
                id: "7",
                name: "src",
                children: [
                  { id: "8", name: "index" },
                  { id: "9", name: "bootstrap" },
                ],
              },
            ],
          },
          {
            id: "10",
            name: "material2",
            children: [
              {
                id: "11",
                name: "src",
                children: [
                  { id: "12", name: "v-btn" },
                  { id: "13", name: "v-card" },
                  { id: "14", name: "v-window" },
                ],
              },
            ],
          },
        ],
      },
    ];
    this.audioFolder1 = this.audioFolder2 = JSON.parse(JSON.stringify(data));
  },

  methods: {
    findTreeItem(items, id) {
      console.log("entering list");
      if (!items) {
        return;
      }

      for (var i = 0; i < items.length; i++) {
        var item = items[i];

        // Test current object
        if (item.id === id) {
          return item;
        }

        // Test children recursively
        const child = this.findTreeItem(item.children, id);
        if (child) {
          return child;
        }
      }
    },

    checkEnd(event) {
      // Si l'objet n'a pas bougé de place
      if (event.from.id === event.to.id) {
        return;
      }

      var itemSelected = this.findTreeItem(this.audioFolder, event.from.id);
      var fromParent = itemSelected.ParentId
        ? this.findTreeItem(this.users, itemSelected.ParentId)
        : null;
      var toParent = this.findTreeItem(this.users, event.to.id);
      var objFrom = fromParent ? fromParent.Children : this.users;
      objFrom.splice(objFrom.indexOf(itemSelected), 1);

      if (toParent.Id === itemSelected.Id) {
        itemSelected.ParentId = null;
        this.users.push(itemSelected);
      } else {
        itemSelected.ParentId = toParent.Id;
        toParent.Children.push(itemSelected);
      }

      // this.saveUser(itemSelected);

      return false;
    },
  },
};
</script>
