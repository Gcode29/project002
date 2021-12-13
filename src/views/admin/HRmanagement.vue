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
                <v-card-title>
                  <span class="text-h5">Category Information</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" lg="4" md="4">
                        <v-text-field
                          label="First Name *"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" lg="4" md="4">
                        <v-text-field
                          label="Middle Name *"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" lg="4" md="4">
                        <v-text-field
                          label="Last Name *"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" lg="4" md="4">
                        <v-text-field label="Age"></v-text-field>
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
                              v-model="date"
                              label="Birth Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date"
                            @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" lg="4" md="4">
                        <v-text-field
                          label="Contact No."
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" lg="6" md="6">
                        <v-text-field
                          label="Emergency Details (Name:Contact#)"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" lg="6" md="6">
                        <v-text-field label="Address" required></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false">
                    Close
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="dialog = false">
                    Save
                  </v-btn>
                </v-card-actions>
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
                      :event-color="getEventColor"
                      :type="type"
                      @click:event="showEvent"
                      @click:more="viewDay"
                      @click:date="viewDay"
                      @change="updateRange"
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
export default {
  data() {
    return {
      snackbar: false,
      timeout: 2000,
      dialog: false,
      dialog2: false,
      editmode: false,
      valid: true,
      // Date time Picker
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      modal: false,
      menu2: false,
      // Date time picker

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
          text: "Name",
          align: "start",
          filterable: false,
          value: "name",
        },
        { text: "Age", value: "age" },
        { text: "Birthday", value: "birthday" },
        { text: "Address", value: "address" },
        { text: "Contact Number", value: "contactno" },
        { text: "Emergency Contact Number", value: "ecn" },
        { text: "Salary", value: "salary" },
        { text: "Test", value: "actions" },
      ],
      desserts: [
        {
          name: "George Daniel S Uy",
          age: 29,
          birthday: "01/29/1993",
          address: "Calamagui 1st, Ilagan Isabela",
          contactno: "09978097411",
          ecn: "09776336766",
          salary: "P35,000",
        },
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
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
      ],
      names: [
        "Meeting",
        "Holiday",
        "PTO",
        "Travel",
        "Event",
        "Birthday",
        "Conference",
        "Party",
      ],
      // Calendar
    };
  },
  // data
  mounted() {
    this.$refs.calendar.checkChange();
  },

  methods: {
    opendialog() {
      this.dialog2 = true;
    },

    closedialog() {
      this.dialog2 = false;
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        });
      }

      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>
