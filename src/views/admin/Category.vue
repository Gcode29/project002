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
      <div v-if="success_add">
        <v-icon color="success" class="mr-1">mdi-check-circle-outline</v-icon>
        Category Successfully Created
      </div>

      <div v-if="success_update">
        <v-icon color="success" class="mr-1">mdi-check-circle-outline</v-icon>
        Category Successfully Updated
      </div>

      <template v-slot:action="{ attrs }">
        <v-btn color="success" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="snackbar2"
      color="#D50000"
      outlined
      top
      right
      elevation="3"
      class="mr-5"
      :timeout="timeout"
    >
      <div>
        <v-icon color="#D50000" class="mr-1">mdi-alert-circle-outline</v-icon>
        ERROR FOUND
      </div>

      <template v-slot:action="{ attrs }">
        <v-btn color="#D50000" text v-bind="attrs" @click="snackbar2 = false">
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
            <h3>Product Categories Manager</h3>

            <v-dialog v-model="dialog" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary rounded-lg"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="New()"
                >
                  Add <v-icon>mdi-text-box-plus-outline</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  prevent="editmode ? save() : update()"
                >
                  <v-card-title>
                    <span class="text-h5">Category Information</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-col cols="12">
                        <v-text-field
                          label="Category Name"
                          v-model="form.category_name"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="Close()">
                      Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="Save()">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-card-title>

          <!-- table -->
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
            :headers="headers"
            :items="desserts"
            :search="search"
            item-key="name"
            :loading="items"
            loading-text="Loading... Please wait"
          ></v-data-table>
          <!-- table/ -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      success_add: false,
      success_update: false,
      snackbar: false,
      snackbar2: false,
      timeout: 2000,
      dialog: false,
      editmode: false,
      valid: true,

      //   loading bar
      loading1: true,
      //   loading bar

      // Rules Validator
      nameRules: [
        (v) => !!v || "This Field is Required",
        (v) => (v && v.length >= 3) || "Must be greater than 3 characters",
      ],
      // Rules Validator

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
      ],
      // table
    };
  },
  // data

  methods: {
    New() {
      (this.editmode = false), (this.dialog = true), this.$refs.form.reset();
      this.id = "";
    },

    Close() {
      (this.editmode = false), (this.dialog = false), this.$refs.form.reset();
      this.id = "";
    },

    Save() {
      this.$refs.form.validate();
      this.Close();
      this.success_add = true;
      this.snackbar = true;
    },

    edit(item) {
      this.editmode = true;
      this.dialog = true;
      this.form.category_name = item.fname;
      this.id = item.id;
    },

    ...mapActions("categories", [
      "getCategory",
      "deleteCategory",
      "updateCategory",
      "addCategory",
    ]),
  },

  computed: {
    ...mapGetters("categories", ["allCategories"]),
  },
  // computed

  async mounted() {
    await this.getCategories();
  },
};
</script>
