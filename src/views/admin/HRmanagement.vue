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
      <div v-if="a">
        <v-icon color="success" class="mr-1">mdi-check-circle-outline</v-icon>
        Employee Record Successfully Created
      </div>

      <div v-if="b">
        <v-icon color="success" class="mr-1">mdi-check-circle-outline</v-icon>
        Employee Record Successfully Updated
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
            <h3>Human and Resource</h3>

            <v-dialog v-model="dialog" persistent max-width="1200px">
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
                      <v-row>
                        <v-col cols="12" lg="4" md="4">
                          <v-text-field
                            label="First Name *"
                            v-model="form.fname"
                            :rules="nameRules"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                          <v-text-field
                            label="Middle Name *"
                            v-model="form.mname"
                            :rules="nameRules"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                          <v-text-field
                            label="Last Name *"
                            v-model="form.lname"
                            :rules="nameRules"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                          <v-text-field
                            label="Age"
                            v-model="form.age"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                          <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="form.bdate"
                                label="Birth Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="form.bdate"
                              @input="menu2 = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                          <v-text-field
                            label="Contact No."
                            v-model="form.contact"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6" md="6">
                          <v-text-field
                            label="Emergency Details (Name:Contact#)"
                            v-model="form.contact2"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6" md="6">
                          <v-text-field
                            label="Address"
                            required
                            v-model="form.address"
                          ></v-text-field>
                        </v-col>
                      </v-row>
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
                      @click="save()"
                    >
                      Save
                    </v-btn>
                    <v-btn
                      v-if="editmode"
                      color="green darken-1"
                      text
                      @click="update()"
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
            :items="allEmployees"
            :search="search"
            item-key="name"
          >
            <template v-slot:item.fullname="{ item }">
              <a href="#" @click="dialog2 = true">{{ item.fullname }}</a>
            </template>
            <template v-slot:item.actions="{ item }">
              <Form :selected="item" />
              <v-btn color="success mb-2 mt-1 mr-2" @click="edit(item)"
                ><v-icon>mdi-clipboard-text-search-outline</v-icon></v-btn
              >
              <v-btn
                color="red mb-2 mt-1 white--text"
                @click="removeEmployee(item.id)"
                ><v-icon>mdi-clipboard-remove-outline</v-icon></v-btn
              >
            </template>
          </v-data-table>
          <!-- table/ -->
        </v-card>
      </v-col>
    </v-row>

    <!-- dialog2 -->
    <v-dialog v-model="dialog2" transition="dialog-top-transition" fullscreen>
      <template>
        <v-card>
          <v-toolbar flat dark color="primary">
            <v-btn disabled icon>
              <v-icon>mdi-account-details</v-icon>
            </v-btn>
            <v-toolbar-title>George Daniel S Uy</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon dark @click="closedialog()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items></v-toolbar
          >

          <v-container>
            <v-card-body>
              <v-row>
                <!--  -->
                <v-col cols="12" md="6" lg="6">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="Event Name" v-model="form.name" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" lg="6">
                      <v-text-field type="date" v-model="form.dateFrom" />
                    </v-col>
                    <v-col cols="12" lg="6">
                      <v-text-field type="date" v-model="form.dateTo" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-btn depressed color="primary" @click="save">
                        Save
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <!--  -->

                <!--  -->
                <v-col cols="12" md="6" lg="6"
                  ><v-sheet height="64">
                    <v-toolbar flat>
                      <v-btn
                        outlined
                        class="mr-4"
                        color="grey darken-2"
                        @click="setToday"
                      >
                        Today
                      </v-btn>
                      <v-btn fab text small color="grey darken-2" @click="prev">
                        <v-icon small> mdi-chevron-left </v-icon>
                      </v-btn>
                      <v-btn fab text small color="grey darken-2" @click="next">
                        <v-icon small> mdi-chevron-right </v-icon>
                      </v-btn>
                      <v-toolbar-title v-if="$refs.calendar">
                        {{ $refs.calendar.title }}
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-menu bottom right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            outlined
                            color="grey darken-2"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <span>{{ typeToLabel[type] }}</span>
                            <v-icon right> mdi-menu-down </v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item @click="type = 'day'">
                            <v-list-item-title>Day</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="type = 'week'">
                            <v-list-item-title>Week</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="type = 'month'">
                            <v-list-item-title>Month</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="type = '4day'">
                            <v-list-item-title>4 days</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-toolbar>
                  </v-sheet>
                  <v-sheet height="600">
                    <v-calendar
                      ref="calendar"
                      v-model="focus"
                      color="primary"
                      :events="events"
                      :type="type"
                      @click:more="viewDay"
                      @click:date="viewDay"
                    ></v-calendar>
                    <v-menu
                      v-model="selectedOpen"
                      :close-on-content-click="false"
                      :activator="selectedElement"
                      offset-x
                    >
                      <v-card color="grey lighten-4" min-width="350px" flat>
                        <v-toolbar :color="selectedEvent.color" dark>
                          <v-btn icon>
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-toolbar-title
                            v-html="selectedEvent.name"
                          ></v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-btn icon>
                            <v-icon>mdi-heart</v-icon>
                          </v-btn>
                          <v-btn icon>
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </v-toolbar>
                        <v-card-text>
                          <span v-html="selectedEvent.details"></span>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn
                            text
                            color="secondary"
                            @click="selectedOpen = false"
                          >
                            Cancel
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-menu>
                  </v-sheet>
                </v-col>
                <!--  -->
              </v-row>
            </v-card-body>
          </v-container>
        </v-card>
      </template>
    </v-dialog>
    <!-- dialog2 -->
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      a: false,
      b: false,
      snackbar: false,
      snackbar2: false,
      timeout: 2000,
      dialog: false,
      dialog2: false,
      valid: true,
      menu2: "",
      // Date time Picker
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      modal: false,
      // Date time picker

      // Rules Validator
      nameRules: [
        (v) => !!v || "This Field is Required",
        (v) => (v && v.length >= 3) || "Must be greater than 3 characters",
      ],
      // Rules Validator

      // form
      editmode: false,
      form: {
        id: "",
        fname: "",
        lname: "",
        mname: "",
        bdate: "",
        age: "",
        contact: "",
        contact2: "",
        address: "",
      },
      // form

      //   loading bar
      loading1: false,
      //   loading bar

      // table
      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          filterable: false,
          value: "fullname",
        },
        { text: "Age", value: "age" },
        { text: "Birthday", value: "birthday" },
        { text: "Address", value: "address" },
        { text: "Contact Number", value: "contactno" },
        { text: "Emergency Contact Number", value: "EMcontact" },
        { text: "Salary", value: "salary" },
        { text: "Test", value: "actions" },
      ],
      // table

      // Calendar
      focus: "",
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days",
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: [
        //
      ],
      names: [
        //
      ],
      // Calendar
    };
  },
  // data

  computed: {
    ...mapGetters("employees", ["allEmployees"]),
  },
  // computed

  async mounted() {
    await this.getEmployee();
  },

  methods: {
    ...mapActions("employees", [
      "getEmployee",
      "deleteEmployee",
      "updateEmployee",
      "addEmployee",
    ]),

    New() {
      (this.editmode = false), (this.dialog = true), this.$refs.form.reset();
      this.id = "";
    },

    Close() {
      (this.editmode = false), (this.dialog = false), this.$refs.form.reset();
      this.id = "";
    },

    closedialog() {
      this.dialog2 = false;
      this.$refs.form.reset();
    },

    edit(item) {
      (this.editmode = true), (this.dialog = true);
      this.form.fname = item.fname;
      this.form.mname = item.mname;
      this.form.lname = item.lname;
      this.form.age = item.age;
      this.form.address = item.address;
      this.form.bdate = item.date;
      this.form.contact = item.contactno;
      this.form.contact2 = item.EMcontact;

      this.id = item.id;
    },

    removeEmployee(id) {
      this.loading1 = true;
      if (confirm("Are you sure you want to Remove this Employee?")) {
        this.loading1 = false;
        this.deleteEmployee(id);
      }

      this.loading1 = false;
    },

    async save() {
      this.$refs.form.validate();
      this.loading1 = true;
      try {
        await this.addEmployee(this.form);
        this.a = true;
        this.snackbar = true;
        this.loading1 = false;
        this.Close();
        this.getEmployee();
      } catch (err) {
        this.snackbar2 = true;
        console.log(err);
        this.loading1 = false;
      }
    },

    async update() {
      this.$refs.form.validate();
      this.loading1 = true;

      this.form = {
        id: this.id,
        lname: this.form.lname,
        mname: this.form.mname,
        fname: this.form.fname,
        age: this.form.age,
        address: this.form.address,
        birthday: this.form.bdate,
        contactno: this.form.contact,
        EMcontact: this.form.contact2,
      };

      try {
        await this.updateEmployee(this.form);
        this.b = true;
        this.snackbar = true;
        this.loading1 = false;
        this.Close();
        this.getEmployee();
      } catch (err) {
        this.loading1 = false;
        console.log(err);
      }
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },

    // calender
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    fetchEvents() {
      //
    },

    // calender
  },
};
</script>
