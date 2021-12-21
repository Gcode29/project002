<template>
  <v-container>
    <div class="dashboard">
      <v-subheader class="d-flex justify-space-between align-center">
        <h3>Dashboard</h3>
        <v-btn color="success" class="rounded-lg"> View Orders </v-btn>
      </v-subheader>
      <v-row>
        <v-col lg="7" cols="12">
          <v-alert dense text type="success">
            <strong>Login Successfully: </strong> Welcome {{ user.fullname }} !
          </v-alert>
          <v-row>
            <v-col
              lg="6"
              cols="12"
              v-for="(item, index) in activities"
              :key="index"
            >
              <v-card elevation="2" class="rounded-lg">
                <v-card-text class="d-flex justify-space-between align-center">
                  <div class="">
                    <strong>{{ item.title }}</strong
                    ><br />
                    <small>Last 2 Weeks</small>
                  </div>
                  <v-avatar :color="item.color" size="60">
                    <span class="white--text">{{ item.amounts }}</span>
                  </v-avatar>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col lg="5" cols="12">
          <v-card>
            <v-card-title>Activities</v-card-title>

            <v-timeline align-top dense>
              <v-timeline-item color="pink" small>
                <v-row class="pt-1">
                  <v-col cols="3">
                    <strong>50 Minutes Ago</strong>
                  </v-col>
                  <v-col>
                    <strong>New Icon</strong>
                    <div class="text-caption">Mobile App</div>
                  </v-col>
                </v-row>
              </v-timeline-item>

              <v-timeline-item color="teal lighten-3" small>
                <v-row class="pt-1">
                  <v-col cols="3">
                    <strong>4 Hours Ago</strong>
                  </v-col>
                  <v-col>
                    <strong>Design Stand Up</strong>
                    <div class="text-caption mb-2">Hangouts</div>
                    <v-avatar>
                      <v-img
                        src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown"
                      ></v-img>
                    </v-avatar>
                    <v-avatar>
                      <v-img
                        src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Prescription02&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Black&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Tanned"
                      ></v-img>
                    </v-avatar>
                    <v-avatar>
                      <v-img
                        src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Pale"
                      ></v-img>
                    </v-avatar>
                  </v-col>
                </v-row>
              </v-timeline-item>

              <v-timeline-item color="pink" small>
                <v-row class="pt-1">
                  <v-col cols="3">
                    <strong>5 Hours Ago</strong>
                  </v-col>
                  <v-col>
                    <strong>Lunch break</strong>
                  </v-col>
                </v-row>
              </v-timeline-item>

              <v-timeline-item color="teal lighten-3" small>
                <v-row class="pt-1">
                  <v-col cols="3">
                    <strong>6 Hours Ago</strong>
                  </v-col>
                  <v-col>
                    <strong>Finish Home Screen</strong>
                    <div class="text-caption">Web App</div>
                  </v-col>
                </v-row>
              </v-timeline-item>
            </v-timeline>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col lg="12">
          <v-card>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              caption="Recent Orders"
              :headers="headers"
              :items="desserts"
              :items-per-page="5"
              :search="search"
            >
              <template v-slot:item.action>
                <v-btn color="success"> View </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      activities: [
        { title: "Total Products", color: "blue darken-1", amounts: 2837 },
        { title: "Total Category", color: "blue darken-3", amounts: 2837 },
        { title: "Total Orders", color: "green accent-3", amounts: 2837 },
        { title: "Pending Orders", color: "orange", amounts: 2837 },
      ],
      search: "",
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "start",
          filterable: false,
          value: "name",
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" },
        { text: "Action", value: "action" },
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%",
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%",
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%",
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%",
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%",
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%",
        },
      ],
    };
  },

  computed: {
    ...mapGetters("auth", ["user"]),
    //
  },

  methods: {
    ...mapActions("auth", ["me"]),
  },

  async mounted() {
    await this.me();
  },
};
</script>
