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
      <span v-if="success_add">Branch Successfully Created</span>

      <span v-if="success_update">Branch Successfully Updated</span>

      <span v-if="success_delete">Branch Successfully Deleted</span>

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
            <h3>Warehouse Manager</h3>

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
                  prevent="editmode ? Save() : Update()"
                >
                  <v-card-title>
                    <span class="text-h5">Branch Information</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-col cols="12">
                        <v-text-field
                          label="Branch Name"
                          v-model="form.branch_name"
                          :rules="nameRules"
                          required
                          v-on:keydown.enter.prevent="Save()"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Address"
                          v-model="form.branch_address"
                          :rules="nameRules"
                          required
                          v-on:keydown.enter.prevent="Save()"
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
                    <v-btn
                      v-if="!editmode"
                      color="blue darken-1"
                      text
                      @click="Save()"
                    >
                      Save
                    </v-btn>
                    <v-btn
                      v-if="editmode"
                      color="green darken-1"
                      text
                      @click="Update()"
                    >
                      Update
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
            :items="allBranches"
            :search="search"
            item-key="name"
          >
            <template v-slot:item.actions="{ item }">
              <Form :selected="item" />
              <v-btn class="success mb-2 mt-1 mr-2" @click="edit(item)"
                ><v-icon>mdi-clipboard-text-search-outline</v-icon></v-btn
              >
              <v-btn
                class="red mb-2 mt-1 white--text"
                @click="deleteBranchMeth(item.id)"
                ><v-icon>mdi-clipboard-remove-outline</v-icon></v-btn
              >
            </template>
          </v-data-table>
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
      success_delete: false,
      snackbar: false,
      snackbar2: false,
      timeout: 2000,
      dialog: false,
      editmode: false,
      valid: true,

      //   loading bar
      loading1: false,
      //   loading bar

      // Rules Validator
      nameRules: [(v) => !!v || "This Field is Required"],
      // Rules Validator

      // form
      form: {
        id: "",
        branch_name: "",
        branch_address: "",
      },
      // form

      // table
      search: "",
      headers: [
        {
          text: "Name",
          align: "center",
          filterable: true,
          value: "branch_name",
        },
        { text: "Address", align: "center", value: "branch_address" },
        { text: "Actions", align: "center", value: "actions" },
      ],
      // table
    };
  },
  // data

  methods: {
    New() {
      this.editmode = false;
      this.dialog = true;
      this.$refs.form.reset();
      this.id = "";
    },

    Close() {
      this.editmode = false;
      this.dialog = false;
      this.$refs.form.reset();
      this.id = "";
    },

    async Save() {
      this.$refs.form.validate();
      this.loading1 = true;
      try {
        await this.addBranch(this.form);
        this.success_add = true;
        this.snackbar = true;
        this.loading1 = false;
        this.Close();
        this.getBranches();
      } catch (err) {
        this.snackbar2 = true;
        console.log(err);
        this.loading1 = false;
      }
    },

    async Update() {
      this.$refs.form.validate();
      this.loading1 = true;

      try {
        await this.updateBranch(this.form);
        this.success_update = true;
        this.snackbar = true;
        this.loading1 = false;
        this.Close();
        this.getBranches();
      } catch (err) {
        this.snackbar2 = true;
        this.loading1 = false;
        console.log(err);
      }
    },

    deleteBranchMeth(id) {
      this.loading1 = true;
      if (confirm("Are you sure you want to Remove this Branch?")) {
        this.loading1 = false;
        this.success_delete = true;
        this.snackbar = true;
        this.deleteBranch(id);
      }

      this.loading1 = false;
    },

    edit(item) {
      this.editmode = true;
      this.dialog = true;
      this.form = {
        id: item.id,
        branch_name: item.branch_name,
        branch_address: item.branch_address,
      };
    },

    ...mapActions("branches", [
      "getBranches",
      "deleteBranch",
      "updateBranch",
      "addBranch",
    ]),
  },

  computed: {
    ...mapGetters("branches", ["allBranches"]),
  },
  // computed

  async mounted() {
    await this.getBranches();
  },
};
</script>
