<template>
  <v-treeview :items="audioFolder" hoverable open-on-click shaped return-object>
    <!-- Prepend icon -->
    <template v-slot:prepend="{ item, open }">
      <div @click="onClick(item)">
        <v-icon
          v-text="
            item.children
              ? open
                ? 'mdi-folder-open'
                : 'mdi-folder'
              : item.path.split('/')[2] === 'Ambiance'
              ? 'mdi-city-variant-outline'
              : item.path.split('/')[2] === 'Musique'
              ? 'mdi-music-note'
              : item.path.split('/')[2] === 'SFX'
              ? 'mdi-ear-hearing'
              : 'mdi-help'
          "
        />
      </div>
    </template>

    <!-- Label -->
    <template v-slot:label="{ item }">
      <draggable
        :class="enableDnd ? (enableEdit ? 'playlist' : 'database') : ''"
        :list="[]"
        :group="enableDnd ? 'node' : ''"
        :id="item.id"
        @end="endDnD"
      >
        <div class="pa-4" @click="onClick(item)">
          <!-- If editing -->
          <v-form
            v-if="!!item.isEditing"
            :ref="`form_playlist_audio_${item.id}`"
            v-model="item.form"
            @submit.prevent
          >
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
                  <v-icon
                    v-text="'mdi-check'"
                    @click.stop="editAudioFromPlaylist(item)"
                  />
                </v-fade-transition>
              </template>
            </v-text-field>
          </v-form>

          <div v-else>
            <span v-if="item.surname">
              {{ item.surname }} <br />
              <span class="font-italic">{{ item.name }}</span>
            </span>
            <span v-else>
              {{ item.name }}
            </span>
          </div>
        </div>
      </draggable>
    </template>

    <!-- Append icon -->
    <template v-slot:append="{ item, open }">
      <div @click="onClick(item)">
        <!-- action : Edit or remove -->
        <div v-if="enableEdit">
          <v-icon
            v-if="item.isEditing"
            class="zoom"
            color="grey lighten-1"
            v-text="'mdi-cancel'"
            @click.stop="cancelEdit(item)"
          />

          <v-icon
            v-else
            class="zoom"
            color="grey lighten-1"
            v-text="'mdi-pencil'"
            @click.stop="beginEdit(item)"
          />

          <!-- action : Remove from playlist -->
          <v-icon
            v-if="enableEdit"
            class="zoom"
            color="grey lighten-1"
            v-text="'mdi-delete'"
          />
        </div>
      </div>
    </template>
  </v-treeview>
</template>

<script>
// Imports
import { mapActions, mapGetters, mapMutations } from "vuex";
import draggable from "vuedraggable";
import EventBus from "@/EventBus.js";
import MixinRules from "@/mixins/mixin-rules";

export default {
  name: "TreeviewAudio",

  components: {
    draggable,
  },

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
    ...mapActions("playlist", ["updatePlaylistAudio"]),
    ...mapMutations("audioPlayer", ["setAudio"]),

    /** */
    onClick(file) {
      if (!!file.path && this.enablePlay && !file.isEditing) {
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
        console.log("euuuh", form.validate());
        // We update the playlist if the surname is different
        if (file.surname !== file.surnameEdit) {
          const data = {
            idPlaylist: this.idPlaylist,
            audio: {
              id: file.id,
              name: file.name,
              surname: file.surnameEdit,
            },
            path: this.pathPlaylist || "",
          };
          const res = await this.updatePlaylistAudio(data);
          console.log("res : ", res);
        }

        // We first edit the object
        this.$set(file, "isEditing", false);
        this.$set(file, "surname", file.surnameEdit);
      }
    },

    /** */
    addAudioToPlaylist(file) {
      EventBus.$emit(EventBus.ADD_TO_PLAYLIST, file);
    },

    /** */
    endDnD(event) {
      const fromIsDatabase = event.from.className.includes("database");
      const fromIsPlaylist = event.from.className.includes("playlist");
      const toIsDatabase = event.to.className.includes("database");
      const toIsPlaylist = event.to.className.includes("playlist");

      // Moving between the database : no action
      if (fromIsDatabase && toIsDatabase) {
        return;
      }

      const eventName =
        fromIsDatabase && toIsPlaylist
          ? EventBus.ADD_TO_PLAYLIST
          : EventBus.MOVE_WITHIN_PLAYLIST;
      EventBus.$emit(eventName, event);
    },
  },
};
</script>
