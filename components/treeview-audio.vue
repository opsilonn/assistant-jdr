<template>
  <div>
    <v-treeview :items="audioFolder" hoverable open-on-click shaped return-object dense>
      <!-- Prepend icon -->
      <template v-slot:prepend="{ item, open }">
        <div @click="onClick(item)">
          <v-icon
            v-text="
              item.children
                ? open
                  ? 'mdi-folder-open'
                  : 'mdi-folder'
                : item.path.split('/')[2].includes('Ambiance')
                ? 'mdi-city-variant-outline'
                : item.path.split('/')[2].includes('Musique')
                ? 'mdi-music-note'
                : item.path.split('/')[2].includes('SFX')
                ? 'mdi-ear-hearing'
                : 'mdi-help'
            "
          />
        </div>
      </template>

      <!-- Label -->
      <template v-slot:label="{ item }">
        <draggable
          :class="{
            playlist: enableDnd && enableEdit,
            database: enableDnd && !enableEdit,
            folder: !!item.children,
          }"
          :list="[]"
          :group="enableDnd ? 'node' : ''"
          :id="item.id"
          @end="endDnD"
        >
          <div class="pa-4" @click="onClick(item)">
            <!-- If editing -->
            <v-form v-if="!!item.isEditing" :ref="`form_playlist_audio_${item.id}`" v-model="item.form" @submit.prevent>
              <v-text-field
                v-model="item.surnameEdit"
                :rules="[rules.max50, rules.ascii]"
                :label="item.name"
                counter
                @click.stop
                @keyup.enter.stop="editAudioFromPlaylist(item)"
              >
                <template v-slot:append>
                  <v-fade-transition leave-absolute>
                    <v-icon v-text="'mdi-check'" @click.stop="editAudioFromPlaylist(item)" />
                  </v-fade-transition>
                </template>
              </v-text-field>
            </v-form>

            <div v-else>
              <span v-if="item.surname">
                {{ item.surname }}<br />
                <span class="font-italic">{{ item.name }}</span>
              </span>
              <span v-else> {{ item.name }} </span>
            </div>
          </div>
        </draggable>
      </template>

      <!-- Append icon -->
      <template v-if="enableEdit" v-slot:append="{ item, open }" @click="onClick(item)">
        <!-- Is editing the name -->
        <v-icon v-if="item.isEditing" class="zoom" color="grey lighten-1" v-text="'mdi-cancel'" @click.stop="cancelEdit(item)" />

        <!-- other actions -->
        <div v-else>
          <!-- add subfolder (only for folders) -->
          <v-icon
            v-if="!!item.children"
            class="zoom"
            color="grey lighten-1"
            v-text="'mdi-folder-multiple-plus'"
            @click.stop="
              open = true;
              cancelEdit(item);
            "
          />

          <!-- Rename item -->
          <v-icon class="zoom" color="grey lighten-1" v-text="'mdi-pencil'" @click.stop="beginEdit(item)" />

          <!-- Remove item -->
          <v-icon class="zoom" color="grey lighten-1" v-text="'mdi-delete'" @click.stop="deleteItemFromPlaylist(item)" />
        </div>
      </template>
    </v-treeview>

    <!-- TO DO : remove this "br" tag and find a proper way to ensure that the footer never covers any data -->
    <br v-for="n in 10" :key="n" />
  </div>
</template>

<script>
// Imports
import { mapActions, mapGetters, mapMutations } from "vuex";
import draggable from "vuedraggable";
import EventBus from "@/EventBus.js";
import MixinRules from "@/mixins/mixin-rules";

export default {
  name: "TreeviewAudio",

  components: { draggable },

  mixins: [MixinRules],

  props: {
    audioFolder: {
      type: Array,
      required: false,
      default: [],
    },
    idPlaylist: {
      type: String,
      required: false,
      default: "",
    },
    enableDnd: {
      type: Boolean,
      required: false,
      default: false,
    },
    enableEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
    enablePlay: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data: () => ({}),

  computed: {
    // Imports
    ...mapGetters("playlist", ["getPlaylistById"]),
  },

  methods: {
    // Imports
    ...mapActions("playlist", ["updatePlaylistAudio", "deleteFromPlaylist"]),
    ...mapMutations("audioPlayer", ["setAudio"]),

    /** */
    onClick(file) {
      if (!file.children && this.enablePlay && !file.isEditing) {
        this.setAudio(file);
      }
    },

    /** */
    beginEdit(file) {
      this.$set(file, "isEditing", true);
      this.$set(file, "form", false);
      this.$set(file, "surnameEdit", file.surname || "");
    },

    /** */
    cancelEdit(file) {
      this.$set(file, "isEditing", false);
    },

    /** */
    async editAudioFromPlaylist(file) {
      // If the form is valid
      const formId = `form_playlist_audio_${file.id}`;
      // const form = this.$refs[formId][0];
      const form = this.$refs[formId];

      if (form.validate()) {
        // We update the playlist if the surname is different
        if (file.surname !== file.surnameEdit) {
          const data = {
            idPlaylist: this.idPlaylist,
            audio: {
              id: file.id,
              name: file.name,
              surname: file.surnameEdit,
            },
          };
          const res = await this.updatePlaylistAudio(data);
        }

        // We first edit the object
        this.$set(file, "isEditing", false);
        this.$set(file, "surname", file.surnameEdit);
      }
    },

    async deleteItemFromPlaylist(item) {
      const data = {
        idPlaylist: this.idPlaylist,
        idItem: item.id,
      };
      const res = await this.deleteFromPlaylist(data);
    },

    /** */
    endDnD(event) {
      const isFromDatabase = event.from.className.includes("database");
      const isFromPlaylist = event.from.className.includes("playlist");
      const isToDatabase = event.to.className.includes("database");
      const isToPlaylist = event.to.className.includes("playlist");

      // Moving between the database : no action
      if (isFromDatabase && isToDatabase) {
        return;
      }

      const eventName = isFromDatabase && isToPlaylist ? EventBus.ADD_TO_PLAYLIST : EventBus.MOVE_WITHIN_PLAYLIST;
      EventBus.$emit(eventName, event);
    },
  },
};
</script>
