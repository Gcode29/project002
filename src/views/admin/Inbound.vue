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
            <h3>Deliveries</h3>

            <v-dialog
              v-model="dialog"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary rounded-lg" dark v-bind="attrs" v-on="on">
                  Add <v-icon>mdi-text-box-plus-outline</v-icon>
                </v-btn>
              </template>
              <v-card
                ><v-toolbar dark color="primary">
                  <v-btn icon dark @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title>Input Item Inventory</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn dark text @click="dialog = false"> Save </v-btn>
                  </v-toolbar-items>
                </v-toolbar>

                <v-container>
                  <v-row>
                    <v-col cols="12" lg="6" md="6">
                      <v-form ref="form" v-model="valid" lazy-validation>
                        <v-row>
                          <v-col cols="8">
                            <v-autocomplete
                              auto-select-first
                              clearable
                              label="Employee Checker"
                              :items="employees"
                              :rules="nameRules"
                              return-object
                              item-text="fullname"
                              v-model="form.employee"
                            />
                          </v-col>
                          <v-col cols="4"
                            ><v-checkbox
                              v-model="form.status"
                              label="Outbound"
                              color="primary"
                              hide-details
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                        <v-divider></v-divider>

                        <v-row>
                          <v-col cols="8">
                            <v-autocomplete
                              auto-select-first
                              clearable
                              label="Product*"
                              :items="products"
                              :rules="nameRules"
                              return-object
                              item-text="product_uniquename"
                              v-model="form.product"
                              @change="fillForm(form.product)"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="4"
                            ><v-select
                              :items="items"
                              label="Warehouse*"
                            ></v-select>
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                              v-model="form.price"
                              label="Price*"
                              type="number"
                              required
                              :rules="nameRules"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                              v-model="form.uom"
                              label="Unit of Measure*"
                              readonly
                              disabled
                              required
                              :rules="nameRules"
                            />
                          </v-col>
                          <v-col lg="6" md="6">
                            <v-text-field
                              v-model="form.quantity"
                              label="Quantity*"
                              type="number"
                              @input="getTotalAmount"
                              @change="getTotalAmount"
                              required
                              :rules="nameRules"
                            />
                          </v-col>
                          <v-col cols="12" lg="6" md="6">
                            <v-text-field
                              v-model="form.totalamount"
                              label="Total Amount*"
                              readonly
                              required
                              :rules="nameRules"
                            />
                          </v-col>
                          <small>*indicates required field</small>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="closeTransaction"
                          >
                            Close
                          </v-btn>
                          <v-btn color="blue darken-1" text @click="addItem()">
                            Add
                          </v-btn>
                        </v-row>
                      </v-form>
                    </v-col>
                    <v-col cols="12" lg="6" md="6">
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">Product Name</th>
                              <th class="text-left">Unit</th>
                              <th class="text-left">Quantity</th>
                              <th class="text-left">Price</th>
                              <th class="text-left">Total</th>
                              <th class="text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(item, index) in transactions"
                              :key="index"
                            >
                              <td>{{ item.product_name }}</td>
                              <td>{{ item.uom }}</td>
                              <td>{{ item.quantity }}</td>
                              <td>{{ item.price }}</td>
                              <td>{{ item.totalamount }}</td>
                              <td>
                                <v-btn
                                  color="red mb-2 mt-1 white--text"
                                  text
                                  @click="removeItem(index)"
                                  ><v-icon
                                    >mdi-clipboard-remove-outline</v-icon
                                  ></v-btn
                                >
                              </td>
                            </tr>
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td class="text-right">Total Amount :</td>
                              <td>P {{ total }}</td>
                              <td></td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-container>
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
          >
            <template v-slot:item.process="{ item }">
              <v-chip :color="getColor(item.process)" dark>
                {{ item.process }}
              </v-chip>
            </template>
            <template v-slot:item.test="{ item }">
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
    <v-dialog v-model="dialog2" width="1200">
      <v-card>
        <v-card-title class="text-h5 teal lighten-2">
          <span class="white--text">Delivery ID : 2021-0001</span>
        </v-card-title>

        <v-card-text class="mt-5">
          <v-data-table
            dense
            :headers="headers2"
            :items="desserts2"
            item-key="name"
            class="elevation-1"
            hide-default-footer
          >
          </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <span class="h2 font-weight-black text-decoration-underline"
            >Grand Total = P 5400</span
          >
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog2 = false"> Confirm </v-btn>
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
      expanded: [],
      singleExpand: false,
      search: "",
      headers: [
        {
          text: "Delivery ID",
          align: "start",
          filterable: false,
          value: "name",
        },
        { text: "Total Amount", value: "process" },
        { text: "No. of Products", value: "fat" },
        { text: "Total Products Count", value: "carbs" },
        { text: "Total Amount", value: "protein" },
        { text: "test", value: "test" },
      ],
      desserts: [
        {
          name: "2021-0001",
          process: "outbound",
          fat: 6.0,
          carbs: 24,
          iron: "1%",
        },
      ],
      // table

      // table2
      headers2: [
        {
          text: "Product Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Quantity", value: "quantity" },
        { text: "Price", value: "price" },
        { text: "Total Price", value: "total_price" },
      ],
      desserts2: [
        {
          name: "Cement",
          quantity: 10,
          price: 215,
          total_price: 2150,
        },
        {
          name: "10 MM",
          quantity: 10,
          price: 115,
          total_price: 1150,
        },
        {
          name: "9 MM",
          quantity: 5,
          price: 90,
          total_price: 350,
        },
        {
          name: "12 MM",
          quantity: 175,
          price: 10,
          total_price: 1750,
        },
      ],

      // table2
    };
  },
  // data
  methods: {
    getColor(process) {
      if (process === "outbound") return "red";
      // else if (process > 200) return "orange";
      else return "green";
    },
    opendialog() {
      this.dialog2 = true;
    },
  },
};
</script>
