<template>
  <v-navigation-drawer v-model="drawer" app>
    <!-- <v-sheet color="grey lighten-4" class="pa-4">
      <v-avatar class="mb-4" color="grey darken-1" size="64"></v-avatar>

      <div>john@vuetifyjs.com</div>
    </v-sheet> -->

    <v-img
      src="https://preview.pixlr.com/images/800wm/1088/2/1088100097.jpg"
      class="pa-4"
      height="150px"
    >
    </v-img>

    <v-divider></v-divider>

    <v-list>
      <div v-for="(link, i) in links" :key="i">
        <v-list-item
          v-if="!link.subLinks"
          :to="link.url"
          avatar
          class="v-list-item"
        >
          <v-list-item-icon>
            <v-icon>{{ link.icons }}</v-icon>
          </v-list-item-icon>

          <v-list-item-title v-text="link.text" />
        </v-list-item>

        <v-list-group
          v-else
          :key="link.text"
          no-action
          :prepend-icon="link.icons"
          :value="false"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </template>

          <v-list-item
            v-for="sublink in link.subLinks"
            :to="sublink.url"
            :key="sublink.text"
          >
            <v-list-item-content>
              <v-list-item-title>{{ sublink.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["drawer"],
  data() {
    return {
      links: [
        {
          icons: "mdi-microsoft-windows",
          text: "Dashboard",
          url: "/dashboard",
        },
        {
          icons: "mdi-account-cog",
          text: "HR Management",
          url: "/UserManagement",
        },
        {
          icons: "mdi-account-cash",
          text: "Transactions",
          subLinks: [
            {
              text: "Transactions",
              url: "/transaction",
            },
            {
              text: "Sales",
              url: "/sales",
            },
            {
              text: "Collection",
              url: "/Collection",
            },
          ],
        },
        {
          icons: "mdi-clipboard-list",
          text: "Inventory",
          subLinks: [
            {
              text: "Storage",
              url: "/Inventory",
            },
            {
              text: "Deliveries",
              url: "/Inbound",
            },
            {
              text: "Warehouses",
              url: "/Branch",
            },
          ],
        },
        {
          icons: "mdi-archive",
          text: "Products",
          subLinks: [
            {
              text: "Product Details",
              url: "/ProductManagement",
            },
            {
              text: "Product Category",
              url: "/ProductCategories",
            },
            {
              text: "Product Sub Category",
              url: "/ProductSubCategories",
            },
          ],
        },
      ],
    };
  },
};
</script>
