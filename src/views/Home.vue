<template>
  <v-app id="app">
    <NavigationBar @handeDrawer="drawer = !drawer" />
    <Sidebar :drawer="drawer" />

    <v-main>
      <!-- <v-container> -->
      <router-view />
      <!-- </v-container> -->
    </v-main>
  </v-app>
</template>

<script>
import NavigationBar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

export default {
  components: { Sidebar, NavigationBar },
  data: () => ({
    cards: ["Today", "Yesterday"],
    drawer: true,
  }),
};
</script>
