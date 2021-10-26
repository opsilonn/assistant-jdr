<script>
export default {
  name: "MixinDice",

  methods: {
    /**
    Returns a random number between 1 and the given maximum
    @param max Maximum value of the dice
    @return A random number between 1 and the given maximum
    */
    random(max) {
      return Math.floor(Math.random() * max) + 1;
    },

    /**
    Returns the value of a set of rolled dice
    @param cptRolls Number of rolls
    @param max Maximum value of the dice
    @return A random number between 1 and the given maximum
    */
    rollDice(cptRolls, max) {
      let roll = 0;
      for (let i = 0; i < cptRolls; i++) {
        roll += this.random(max);
      }
      return roll;
    },

    /**
    Returns whether a given percentage made the roll
    @param percentage Percentage of chance of success
    @return Whether the percentage made the roll
    */
    rollPercentage(percentage) {
      return this.random(100) <= percentage;
    },

    /** Returns a random but sorted set of numbers */
    getRandomizedSet() {
      return [
        this.rollDice(3, 6) * 5,
        this.rollDice(3, 6) * 5,
        this.rollDice(3, 6) * 5,
        this.rollDice(3, 6) * 5,
        this.rollDice(3, 6) * 5,
        (this.rollDice(2, 6) + 6) * 5,
        (this.rollDice(2, 6) + 6) * 5,
        (this.rollDice(2, 6) + 6) * 5
      ]
        .sort()
        .reverse();
    }
  }
};
</script>
