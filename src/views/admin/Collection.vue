<template>
  <v-container>
    <v-snackbar
      v-model="snackbar"
      color="success"
      outlined
      top
      right
      elevation="3"
      class="mr-5"
      :timeout="timeout"
    >
      <v-icon color="success" class="mr-1">mdi-check-circle-outline</v-icon>
      Product Successfully Created

      <template v-slot:action="{ attrs }">
        <v-btn color="success" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-progress-linear
      :active="loading1"
      :indeterminate="loading1"
      absolute
      top
      color="teal lighten-2"
    ></v-progress-linear>

    <v-spacer></v-spacer>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <h3>Collections</h3>
          </v-card-title>

          <!-- table -->
          <v-card-title>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-title>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="desserts"
            item-key="name"
            class="elevation-1"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="opendialog(item)">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
          <!-- table/ -->
        </v-card>
      </v-col>
    </v-row>

    <!-- dialog1 -->
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <v-toolbar flat dark color="primary">
          <v-btn disabled icon dark @click="dialog = false">
            <v-icon>mdi-account-details</v-icon>
          </v-btn>
          <v-toolbar-title>Diwata Commercial</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
          <v-menu bottom right offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="() => {}"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
        <v-card-text>
          <v-card>
            <v-card-title>
              <v-col cols="12"></v-col>
              <v-col
                ><v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="Search"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-col> </v-row
              ></v-col>
            </v-card-title>
            <v-card-body>
              <v-data-table
                v-model="selected"
                :headers="headers1"
                :items="desserts1"
                :single-select="singleSelect"
                item-key="name"
                show-select
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-switch
                    v-model="singleSelect"
                    label="Single select"
                    class="pa-3"
                  ></v-switch>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="opendialog2(item)">
                    mdi-pencil
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-body>
          </v-card>
        </v-card-text>

        <div style="flex: 1 1 auto"></div>
      </v-card>
    </v-dialog>
    <!-- dialog1 -->

    <!-- dialog2 -->
    <v-dialog v-model="dialog2" width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">2021-0001</span>
        </v-card-title>
        <v-card-body>
          <v-data-table
            :headers="headers3"
            :items="desserts3"
            hide-default-footer
            class="elevation-1"
          >
            <template v-slot:item.glutenfree="{ item }">
              <v-simple-checkbox
                v-model="item.glutenfree"
                disabled
              ></v-simple-checkbox>
            </template>
          </v-data-table>
        </v-card-body>
        <v-card-actions>
          <span class="text-h5">Total Amount : P100.00</span>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog2 = false">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialog2 -->
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      timeout: 2000,
      dialog: false,
      dialog2: false,
      dialog3: false,
      editmode: false,
      valid: true,

      //   loading bar
      loading1: true,
      watch: {
        loading1(val) {
          if (!val) return;

          setTimeout(() => (this.loading1 = false), 3000);
        },
      },
      //   loading bar

      // form
      categories: [],
      form: {
        category_name: "",
      },
      // form

      // table
      search: "",
      headers: [
        {
          text: "Client Name",
          align: "start",
          filterable: false,
          value: "name",
        },
        { text: "Collectibles", value: "collectibles" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      desserts: [
        {
          name: "Diwata Commercial",
          collectibles: "P1000.00",
        },
      ],
      // table

      // table2
      search1: "",
      headers1: [
        {
          text: "Receipt No.",
          align: "start",
          filterable: false,
          value: "name",
        },
        { text: "Amount", value: "collectibles" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      desserts1: [
        {
          name: "2021-0001",
          collectibles: "P100.00",
        },
        {
          name: "2021-0002",
          collectibles: "P100.00",
        },
        {
          name: "2021-0003",
          collectibles: "P100.00",
        },
        {
          name: "2021-0004",
          collectibles: "P100.00",
        },
        {
          name: "2021-0005",
          collectibles: "P100.00",
        },
        {
          name: "2021-0006",
          collectibles: "P100.00",
        },
        {
          name: "2021-0007",
          collectibles: "P100.00",
        },
        {
          name: "2021-0008",
          collectibles: "P100.00",
        },
        {
          name: "2021-0009",
          collectibles: "P100.00",
        },
        {
          name: "2021-0010",
          collectibles: "P100.00",
        },
      ],
      // table2

      // table3
      desserts3: [
        {
          name: "Cement",
          calories: 5,
          fat: 5,
          carbs: 25,
          glutenfree: false,
        },
        {
          name: "10 MM",
          calories: 5,
          fat: 5,
          carbs: 25,
          glutenfree: false,
        },
        {
          name: "9 MM",
          calories: 5,
          fat: 5,
          carbs: 25,
          glutenfree: false,
        },
        {
          name: "12 MM",
          calories: 5,
          fat: 5,
          carbs: 25,
          glutenfree: false,
        },
      ],
      headers3: [
        {
          text: "Product Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Qty", value: "calories" },
        { text: "Price", value: "fat" },
        { text: "Total Price", value: "carbs" },
        { text: "Status", value: "glutenfree" },
      ],
      // table3
    };
  },
  // data
  methods: {
    opendialog() {
      this.dialog = true;
    },
    opendialog2() {
      this.dialog2 = true;
    },
    closedialog() {
      this.dialog = false;
    },
    closedialog2() {
      this.dialog2 = false;
    },
  },
  // methods
};
</script>
