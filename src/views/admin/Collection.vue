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
      <span v-if="success_add">Client Successfully Created</span>

      <span v-if="success_update">Client Successfully Updated</span>

      <span v-if="success_delete">Client Successfully Deleted</span>

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
            <h3>Collections</h3>

            <v-btn
              color="primary rounded-lg"
              dark
              v-bind="attrs"
              v-on="on"
              @click="New()"
            >
              Add <v-icon>mdi-text-box-plus-outline</v-icon>
            </v-btn>
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
            :items="allClients"
            item-key="name"
            class="elevation-1"
          >
            <template v-slot:item.client_name="{ item }">
              <a href="#" @click="viewCollections(item.id)">{{
                item.client_name
              }}</a> </template
            >deleteClientMeth
            <template v-slot:item.test="{ item }">
              <v-icon small class="mr-2" @click="editDialog(item)">
                mdi-pencil
              </v-icon>
            </template>
            <template v-slot:item.actions="{ item }">
              <Form :selected="item" />
              <v-btn class="success mb-2 mt-1 mr-2" @click="edit(item)"
                ><v-icon>mdi-clipboard-text-search-outline</v-icon></v-btn
              >
              <v-btn
                class="red mb-2 mt-1 white--text"
                @click="openDeleteDialog(item.id)"
                ><v-icon>mdi-clipboard-remove-outline</v-icon></v-btn
              >
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

    <!-- dialog3 -->
    <v-dialog v-model="dialog3" persistent max-width="600px">
      <v-card>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          prevent="editmode ? Save() : Update()"
        >
          <v-card-title>
            <span class="text-h5">Client Profile</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="8" md="8">
                  <v-text-field
                    label="Client name*"
                    v-model="form.clientname"
                    :rules="nameRules"
                    required
                    v-on:keydown.enter.prevent="Save()"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Contact*"
                    v-model="form.contact"
                    :rules="nameRules"
                    required
                    v-on:keydown.enter.prevent="Save()"
                  />
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Business Name"
                    v-model="form.businessname"
                    v-on:keydown.enter.prevent="Save()"
                  />
                </v-col>
                <v-col cols="12" sm="8" md="8">
                  <v-text-field
                    label="Address"
                    v-model="form.address"
                    v-on:keydown.enter.prevent="Save()"
                  />
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="Close()"> Close </v-btn>
            <v-btn v-if="!editmode" color="blue darken-1" text @click="Save()">
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
    <!-- dialog3 -->

    <!-- DELETE DELIVERY (Dialog4) -->
    <v-dialog v-model="dialog4" persistent max-width="360">
      <v-card>
        <v-toolbar class="text-h7 red white--text" dark>
          <span>
            Are you sure you want to Delete?
            <v-icon class="yellow--text">mdi-alert</v-icon></span
          >
        </v-toolbar>
        <v-card-text class="mt-2 font-weight-bold text-center">
          All data will be lost
        </v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialog4 = false">
            Disagree
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="removeClient(id)">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- DELETE DELIVERY (Dialog4) -->
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
      dialog2: false,
      dialog3: false,
      dialog4: false,
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
      form: {
        id: "",
        clientname: "",
        businessname: "",
        address: "",
        contact: "",
      },
      // form

      // table
      search: "",
      headers: [
        {
          text: "Client Name",
          align: "start",
          filterable: false,
          value: "client_name",
        },
        { text: "Contact", value: "contact" },
        { text: "Address", value: "address" },
        { text: "Test", value: "test", sortable: false },
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
    ...mapActions("clients", [
      "getClients",
      "deleteClient",
      "updateClient",
      "addClient",
    ]),

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

    New() {
      this.dialog3 = true;
      this.editmode = false;
      this.id = "";
    },

    Close() {
      this.dialog3 = false;
      this.$refs.form.reset();
      this.id = "";
      this.editmode = false;
    },

    viewCollections(id) {
      this.getClientCollections(id);
      this.dialog2 = true;
      this.idHeader = id;
      console.log(id);
    },

    edit(item) {
      this.editmode = true;
      this.dialog3 = true;
      this.form = {
        id: item.id,
        clientname: item.client_name,
        businessname: item.business_name,
        address: item.address,
        contact: item.contact,
      };
    },

    async Save() {
      this.$refs.form.validate();
      this.loading1 = true;
      try {
        await this.addClient(this.form);
        this.success_add = true;
        this.snackbar = true;
        this.loading1 = false;
        this.Close();
        this.getClients();
      } catch (err) {
        this.snackbar2 = true;
        console.log(err);
        this.loading1 = false;
      }
    },

    openDeleteDialog(id) {
      this.id = id;
      this.loading1 = true;
      this.dialog4 = true;
    },

    removeClient(id) {
      this.loading1 = false;
      this.success_delete = true;
      this.snackbar = true;
      this.deleteClient(id);
      this.getClients();
      this.dialog4 = false;
    },

    async Update() {
      this.$refs.form.validate();
      this.loading1 = true;

      try {
        await this.updateClient(this.form);
        this.success_update = true;
        this.snackbar = true;
        this.loading1 = false;
        this.Close();
        this.getClients();
      } catch (err) {
        this.snackbar2 = true;
        this.loading1 = false;
        console.log(err);
      }
    },
  },
  // methods

  computed: {
    ...mapGetters("clients", ["allClients"]),
  },
  // computed

  async mounted() {
    await this.getClients();
  },
};
</script>
