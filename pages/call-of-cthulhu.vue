<template>
  <v-container>
    <!-- Titre -->
    <h2 class="text-center">L'appel de Cthulhu</h2>

    <!-- Boutons -->
    <div class="d-flex justify-space-around">
      <!-- Bouton relancer -->
      <v-btn @click="applyOrientation()">
        <v-icon left>
          mdi-dice-6-outline
        </v-icon>
        Relancer
      </v-btn>

      <!-- Bouton réinitialiser -->
      <v-btn @click="resetForm()">
        <v-icon left>
          mdi-autorenew
        </v-icon>
        Réinitialiser
      </v-btn>
    </div>

    <!-- stats -->
    <v-row align="center" justify="center">
      <!-- col n° 1 - GUI -->
      <v-col class="pa-4" sm="12" md="4">
        <!-- Orientation -->
        <v-select
          class="pa-8"
          v-model="orientation"
          :items="itemsOrientation"
          label="Orientation"
          @change="applyOrientation()"
        />

        <!-- Âge -->
        <v-select
          class="pa-8"
          v-model="age"
          :items="itemsAge"
          label="Âge"
          @change="applyAge()"
        />
      </v-col>

      <v-divider vertical />

      <!-- col n° 2 - Caractéristiques et cie -->
      <v-col class="pa-4" sm="12" md="4">
        <!-- Caractéristiques -->
        <v-row>
          <v-col
            cols="6"
            v-for="(item, index) in Object.keys(
              statsDisplayed.caractéristiques
            )"
            :key="index"
          >
            <v-text-field
              v-model.number="statsDisplayed.caractéristiques[item]"
              :label="item"
              onkeypress="return event.charCode >= 48"
              readonly
            />
          </v-col>
        </v-row>

        <h3 class="text-center">Total : {{ getTotal }}</h3>

        <v-divider class="pa-4" />

        <!-- autres -->
        <v-row>
          <v-col
            cols="3"
            v-for="(item, index) in Object.keys(statsDisplayed.autres)"
            :key="index"
          >
            <v-text-field
              v-model="statsDisplayed.autres[item]"
              :label="item"
              onkeypress="return event.charCode >= 48"
              readonly
            />
          </v-col>
        </v-row>
      </v-col>

      <v-divider vertical />

      <!-- col n° 3 - Compétences -->
      <v-col class="pa-4" sm="12" md="4">
        <v-list v-if="compétences.length">
          <template v-for="(compétence, index) in compétences">
            <v-divider v-if="index !== 0" />

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title v-text="compétence.nom" />
              </v-list-item-content>
              <v-list-item-action v-text="compétence.valeur" />
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Imports
import Investigateur from "@/models/models/Investigateur";
import MixinDice from "@/mixins/mixin-dice";
import MixinRules from "@/mixins/mixin-rules";

export default {
  name: "PageCallOfCthulhu",
  transition: "slide-bottom",

  mixins: [MixinDice, MixinRules],

  data: () => ({
    orientation: "",
    age: "",

    statsBase: { caractéristiques: {}, autres: {} },
    statsDisplayed: { caractéristiques: {}, autres: {} },
    compétences: [],

    itemsOrientation: ["Équilibré", "Combat", "Intello"],
    itemsAge: [
      "15 => 19 :  2 jets pour la chance ; -5 FOR / TAI, -5 EDU",
      "20 => 39 : 1 test expérience en EDU",
      "40 => 49 : 2 tests expériences en EDU ; -5 FOR / CON / DEX ; -5 APP",
      "50 => 59 : 3 tests expériences en EDU ; -10 FOR / CON / DEX ; -10 APP",
      "60 => 69 : 4 tests expériences en EDU ; -20 FOR / CON / DEX ; -15 APP",
      "70 => 79 : 4 tests expériences en EDU ; -40 FOR / CON / DEX ; -20 APP",
      "80 => 89 : 4 tests expériences en EDU ; -80 FOR / CON / DEX ; -25 APP"
    ],

    itemsCompétenceCombat: [
      { nom: "Corps-à-corps", valeur: 25 },
      { nom: "Combat à distance - arme de poing", valeur: 20 },
      { nom: "Corps-à-corps", valeur: 25 }
    ],
    itemsCompétences: []
  }),

  computed: {
    /** */
    getTotal() {
      return Object.keys(this.statsDisplayed.caractéristiques).reduce(
        (previous, key) => previous + this.statsDisplayed.caractéristiques[key],
        0
      );
    }
  },

  watch: {
    "statsBase.caractéristiques.constitution": function(val) {
      this.setPV();
    },
    "statsBase.caractéristiques.dextérité": function(val) {
      this.setMouvement();
      const newVal = Math.floor(val / 2);
      this.statsBase.autres.esquive = newVal;
      this.statsDisplayed.autres.esquive = newVal;
    },
    "statsBase.caractéristiques.force": function(val) {
      this.setMouvement();
      this.setCarrure();
      this.setImpact();
    },
    "statsBase.caractéristiques.pouvoir": function(val) {
      this.statsBase.autres.mana = val;
      this.statsBase.autres.sanité = val;
      this.statsDisplayed.autres.mana = val;
      this.statsDisplayed.autres.sanité = val;
    },
    "statsBase.caractéristiques.taille": function(val) {
      this.setMouvement();
      this.setPV();
      this.setCarrure();
      this.setImpact();
    }
  },

  mounted() {
    this.resetForm();
    this.setPV();
  },

  methods: {
    /** Resets everything in the form */
    resetForm() {
      this.orientation = this.itemsOrientation[0];
      this.age = this.itemsAge[0];

      this.statsBase = this.resetStats();
      this.statsDisplayed = this.resetStats();
    },

    /** Sets the default value for a set of stats */
    resetStats() {
      return {
        caractéristiques: {
          apparence: 50,
          constitution: 50,
          dextérité: 50,
          éducation: 50,
          force: 50,
          intelligence: 50,
          taille: 50,
          pouvoir: 50
        },
        autres: {
          mouvement: 8,
          chance: 50,
          pv: 10,
          mana: 10,
          sanité: 50,
          impact: 0,
          carrure: 0,
          esquive: 20
        }
      };
    },

    /** */
    applyOrientation() {
      if (this.orientation === this.itemsOrientation[0]) {
        // Default random
        this.statsBase.caractéristiques.apparence = this.rollDice(3, 6) * 5;
        this.statsBase.caractéristiques.constitution = this.rollDice(3, 6) * 5;
        this.statsBase.caractéristiques.dextérité = this.rollDice(3, 6) * 5;
        this.statsBase.caractéristiques.force = this.rollDice(3, 6) * 5;
        this.statsBase.caractéristiques.pouvoir = this.rollDice(3, 6) * 5;
        this.statsBase.caractéristiques.éducation =
          (this.rollDice(2, 6) + 6) * 5;
        this.statsBase.caractéristiques.intelligence =
          (this.rollDice(2, 6) + 6) * 5;
        this.statsBase.caractéristiques.taille = (this.rollDice(2, 6) + 6) * 5;
      } else if (this.orientation === this.itemsOrientation[1]) {
        // Battle
        // We create a random set
        const set = this.getRandomizedSet();

        // We favorise the battle stats
        this.statsBase.caractéristiques.force = this.rollPercentage(75)
          ? set.shift()
          : set.splice(Math.random() * set.length, 1)[0];
        this.statsBase.caractéristiques.constitution = this.rollPercentage(75)
          ? set.shift()
          : set.splice(Math.random() * set.length, 1)[0];
        this.statsBase.caractéristiques.taille = this.rollPercentage(75)
          ? set.shift()
          : set.splice(Math.random() * set.length, 1)[0];

        this.statsBase.caractéristiques.dextérité = set.splice(
          Math.random() * set.length,
          1
        )[0];
        this.statsBase.caractéristiques.apparence = set.splice(
          Math.random() * set.length,
          1
        )[0];
        this.statsBase.caractéristiques.pouvoir = set.splice(
          Math.random() * set.length,
          1
        )[0];
        this.statsBase.caractéristiques.intelligence = set.splice(
          Math.random() * set.length,
          1
        )[0];
        this.statsBase.caractéristiques.éducation = set.splice(
          Math.random() * set.length,
          1
        )[0];
      } else {
        // Support
        // We create a random set
        const set = this.getRandomizedSet();

        // We favorise the support stats
        this.statsBase.caractéristiques.éducation = this.rollPercentage(75)
          ? set.shift()
          : set.splice(Math.random() * set.length, 1)[0];
        this.statsBase.caractéristiques.intelligence = this.rollPercentage(75)
          ? set.shift()
          : set.splice(Math.random() * set.length, 1)[0];
        this.statsBase.caractéristiques.pouvoir = this.rollPercentage(75)
          ? set.shift()
          : set.splice(Math.random() * set.length, 1)[0];
        this.statsBase.caractéristiques.apparence = set.splice(
          Math.random() * set.length,
          1
        )[0];
        this.statsBase.caractéristiques.dextérité = set.splice(
          Math.random() * set.length,
          1
        )[0];
        this.statsBase.caractéristiques.taille = set.splice(
          Math.random() * set.length,
          1
        )[0];
        this.statsBase.caractéristiques.constitution = set.splice(
          Math.random() * set.length,
          1
        )[0];
        this.statsBase.caractéristiques.force = set.splice(
          Math.random() * set.length,
          1
        )[0];
      }

      // Autres (certains sont calculés automatiquement par des Watchers)
      this.statsBase.autres.chance = this.rollDice(1, 100);

      // We reset the stats
      this.statsDisplayed = this.statsBase;

      this.applyCompétences();
    },

    /** */
    applyAge() {
      // We reset the stats
      this.statsDisplayed = this.statsBase;

      // We get the selected index
      const index = this.itemsAge.indexOf(this.age);

      if (index === 0) {
        // cas spécial : enfant
        if (this.age === this.itemsAge[1]) {
          this.statsDisplayed.caractéristiques.taille -= 5;
        } else if (this.age === this.itemsAge[2]) {
          this.statsDisplayed.caractéristiques.force -= 5;
        } else {
          const rnd = this.rollDice(1, 5);
          this.statsDisplayed.caractéristiques.force -= rnd;
          this.statsDisplayed.caractéristiques.taille -= 5 - rnd;
        }
        this.statsDisplayed.caractéristiques.éducation -= 5;
        this.statsDisplayed.autres.chance = Math.max(
          this.statsBase.autres.chance,
          this.rollDice(1, 100)
        );
      } else {
        // Test(s) d'expérience, compris entre 1 et 4
        this.textExpérience(Math.min(index, 4));

        // For index strictly above 1 : lower some stats
        if (index > 1) {
          let baisse = 5;
          for (let i = 2; i < index; i++) {
            baisse = baisse * 2;
          }

          // baisse Mouvement
          this.statsDisplayed.autres.mouvement -= index - 1;
        }

        // baisse d'apparence
        this.statsDisplayed.caractéristiques.apparence -= 5 * (index - 1);
      }
    },

    applyCompétences() {
      // On réinitialise les compétences
      this.compétences = [];

      // 1 - COMBAT
      // On crée une copie des compétences de combat
      let shuffledCombat = this.shuffleArray(this.itemsCompétenceCombat);

      //On récupère l'index choisi
      const index = this.itemsOrientation.indexOf(this.orientation);
      const arr = [
        { cpt: 2, min: 20, écart: 20 },
        { cpt: 2, min: 30, écart: 20 },
        { cpt: 1, min: 25, écart: 30 }
      ];

      // On ajoute autant de compétences que prévu
      for (let i = 0; i < arr[index].cpt; i++) {
        const compétence = shuffledCombat.shift();
        compétence.valeur +=
          arr[index].min + this.rollDice(1, arr[index].écart);
        this.compétences.push(compétence);
      }
    },

    /** */
    setMouvement() {
      this.statsBase.autres.mouvement = 9;
      if (
        this.statsBase.caractéristiques.force >
        this.statsBase.caractéristiques.taille
      ) {
        this.statsBase.autres.mouvement--;
      }
      if (
        this.statsBase.caractéristiques.dextérité >
        this.statsBase.caractéristiques.taille
      ) {
        this.statsBase.autres.mouvement--;
      }
    },

    /** */
    setPV() {
      this.statsBase.autres.pv = Math.floor(
        (this.statsBase.caractéristiques.constitution +
          this.statsBase.caractéristiques.taille) /
          10
      );
      this.statsBase.autres.pv = this.statsDisplayed.autres.pv;
    },

    /** */
    setCarrure() {
      const total =
        this.statsBase.caractéristiques.force +
        this.statsBase.caractéristiques.taille;
      const carrure =
        2 <= total && total <= 64
          ? -2
          : 65 <= total && total <= 84
          ? -1
          : 85 <= total && total <= 124
          ? 0
          : 125 <= total && total <= 164
          ? 1
          : 2;

      this.statsBase.autres.carrure = carrure;
      this.statsDisplayed.autres.carrure = carrure;
    },

    /** */
    setImpact() {
      const total =
        this.statsBase.caractéristiques.force +
        this.statsBase.caractéristiques.taille;
      const impact =
        2 <= total && total <= 64
          ? -2
          : 65 <= total && total <= 84
          ? -1
          : 85 <= total && total <= 124
          ? 0
          : 125 <= total && total <= 164
          ? "1D4"
          : "1D6";

      this.statsBase.autres.impact = impact;
      this.statsDisplayed.autres.impact = impact;
    },

    /** */
    textExpérience(cpt) {
      for (let i = 0; i < cpt; i++) {
        if (
          this.rollDice(1, 100) > this.statsDisplayed.caractéristiques.éducation
        ) {
          this.statsDisplayed.caractéristiques.éducation += this.rollDice(
            1,
            10
          );
        }
      }
    },

    shuffleArray(arr) {
      return JSON.parse(JSON.stringify(arr)).sort(() => Math.random() - 0.5);
    }
  },

  head() {
    return { title: "L'appel de Cthulhu" };
  }
};
</script>
