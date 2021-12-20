<template>
  <v-app-bar app color="white" elevate-on-scroll elevation="4">
    <v-app-bar-nav-icon @click="$emit('handeDrawer')"></v-app-bar-nav-icon>

    <v-toolbar-title>Record Management Application</v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="n in 5" :key="n" @click="() => {}">
          <v-list-item-title>Option {{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <span
          v-bind="attrs"
          v-on="on"
          style="cursor: pointer"
          class="mx-5 mr-10"
        >
          <v-chip link>
            <v-badge dot bottom offset-y="10" offset-x="10" color="green">
              <v-avatar size="40">
                <img src="https://randomuser.me/api/portraits/men/3.jpg" />
              </v-avatar>
            </v-badge>
            <span>Admin</span>
          </v-chip>
        </span>
      </template>
      <v-list width="250" class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/3.jpg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span>Admin</span>
            </v-list-item-title>
            <v-list-item-subtitle> Logged In </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item
          v-for="(menu, index) in menus"
          :key="index"
          :to="menu.url"
          @click="menu.method"
        >
          <v-list-item-icon>
            <v-icon class="mr-5">
              {{ menu.icon }}
            </v-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ menu.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NavigationBar",
  data() {
    return {
      menus: [
        { title: "Profile", icon: "mdi-account", url: "/profile" },
        { title: "Logout", icon: "mdi-logout", method: () => this.logout() },
      ],
    };
  },
  // data

  computed: {
    ...mapGetters("auth", ["isLogged"]),
  },
  // computed

  methods: {
    async logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
  },
  // methods
};
</script>
