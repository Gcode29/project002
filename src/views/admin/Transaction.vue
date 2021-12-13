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
            <h3>Transactions</h3>

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
              <v-card>
                <v-toolbar dark color="primary">
                  <v-btn icon dark @click="closeTransaction">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title>Input Item Inventory</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn dark text @click="transationComplete"> Save </v-btn>
                  </v-toolbar-items>
                </v-toolbar>

                <v-container fluid>
                  <v-row>
                    <v-col cols="12" lg="6" md="6">
                      <v-form ref="form" v-model="valid" lazy-validation>
                        <v-row>
                          <v-col cols="8">
                            <v-text-field
                              v-model="form.price"
                              label="Client Name"
                              type="number"
                              required
                              :rules="nameRules"
                            />
                          </v-col>
                          <v-col cols="4"
                            ><v-text-field
                              v-model="form.price"
                              label="Cash*"
                              type="number"
                              required
                              :rules="nameRules"
                            />
                          </v-col>
                        </v-row>
                        <v-divider></v-divider>

                        <v-row>
                          <v-col cols="12">
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
          <v-container fluid>
            <!-- table -->
            <v-data-iterator
              :items="items"
              :items-per-page.sync="itemsPerPage"
              :page.sync="page"
              :search="search"
              :sort-by="sortBy.toLowerCase()"
              :sort-desc="sortDesc"
              hide-default-footer
            >
              <template v-slot:header>
                <v-toolbar dark color="blue darken-3" class="mb-1">
                  <v-text-field
                    v-model="search"
                    clearable
                    flat
                    solo-inverted
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    label="Search"
                  ></v-text-field>
                  <template v-if="$vuetify.breakpoint.mdAndUp">
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-btn-toggle v-model="sortDesc" mandatory>
                      <v-btn large depressed color="blue" :value="false">
                        <v-icon>mdi-arrow-up</v-icon>
                      </v-btn>
                      <v-btn large depressed color="blue" :value="true">
                        <v-icon>mdi-arrow-down</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </template>
                </v-toolbar>
              </template>

              <template v-slot:default="props">
                <v-row>
                  <v-col
                    v-for="item in props.items"
                    :key="item.name"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                  >
                    <v-card>
                      <!--  -->
                      <v-card-title class="subheading font-weight-bold">
                        <v-btn @click="dialog2 = true">{{ item.name }}</v-btn>
                      </v-card-title>
                      <!--  -->
                      <v-divider></v-divider>

                      <v-list dense>
                        <v-list-item
                          v-for="(key, index) in filteredKeys"
                          :key="index"
                        >
                          <v-list-item-content
                            :class="{ 'blue--text': sortBy === key }"
                          >
                            {{ key }}:
                          </v-list-item-content>
                          <v-list-item-content
                            class="align-end"
                            :class="{ 'blue--text': sortBy === key }"
                          >
                            {{ item[key.toLowerCase()] }}
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                </v-row>
              </template>

              <template v-slot:footer>
                <v-row class="mt-2" align="center" justify="center">
                  <span class="grey--text">Items per page</span>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dark
                        text
                        color="primary"
                        class="ml-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ itemsPerPage }}
                        <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(number, index) in itemsPerPageArray"
                        :key="index"
                        @click="updateItemsPerPage(number)"
                      >
                        <v-list-item-title>{{ number }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <v-spacer></v-spacer>

                  <span class="mr-4 grey--text">
                    Page {{ page }} of {{ numberOfPages }}
                  </span>
                  <v-btn
                    fab
                    dark
                    color="blue darken-3"
                    class="mr-1"
                    @click="formerPage"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    dark
                    color="blue darken-3"
                    class="ml-1"
                    @click="nextPage"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-row>
              </template>
            </v-data-iterator>
            <!-- table/ -->
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <!--  -->
    <v-row justify="center">
      <v-dialog
        v-model="dialog2"
        fullscreen
        hide-overlay
        transition="dialog-top-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog2 = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Receipt No. : {2021-0001}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-container>
            <v-row>
              <v-col cols="12" lg="6" md="6">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.price"
                        label="Nullable"
                        type="number"
                        required
                        :rules="nameRules"
                      />
                    </v-col>
                    <v-col cols="6"
                      ><v-text-field
                        v-model="form.price"
                        label="2500"
                        type="number"
                        required
                        :rules="nameRules"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="form.price"
                        label="2330"
                        type="number"
                        required
                        :rules="nameRules"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="form.uom"
                        label="Discount"
                        readonly
                        disabled
                        required
                        :rules="nameRules"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="form.uom"
                        label="Change"
                        readonly
                        disabled
                        required
                        :rules="nameRules"
                      />
                    </v-col>
                    <small>*indicates required field</small>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeTransaction">
                      Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="addItem()">
                      Save
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
                      <tr v-for="(item, index) in transactions" :key="index">
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
    </v-row>
    <!--  -->
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
      itemsPerPageArray: [8, 16, 24],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 8,
      sortBy: "name",
      keys: ["Name", "Products", "Amount", "Cash", "Change"],
      items: [
        {
          name: "2021-0001",
          products: 5,
          amount: 2330.0,
          cash: 2500.0,
          change: 170,
        },
        {
          name: "2021-0002",
          products: 237,
          amount: 9.0,
          cash: 37,
          change: 4.3,
        },
        {
          name: "2021-0003",
          products: 262,
          amount: 16.0,
          cash: 23,
          change: 6.0,
        },
        {
          name: "2021-0004",
          products: 305,
          amount: 3.7,
          cash: 67,
          change: 4.3,
        },
        {
          name: "2021-0005",
          products: 356,
          amount: 16.0,
          cash: 49,
          change: 3.9,
        },
        {
          name: "2021-0006",
          products: 375,
          amount: 0.0,
          cash: 94,
          change: 0.0,
        },
        {
          name: "2021-0007",
          products: 392,
          amount: 0.2,
          cash: 98,
          change: 0,
        },
        {
          name: "2021-0008",
          products: 408,
          amount: 3.2,
          cash: 87,
          change: 6.5,
        },
        {
          name: "2021-0009",
          products: 452,
          amount: 25.0,
          cash: 51,
          change: 4.9,
        },
        {
          name: "2021-0010",
          products: 518,
          amount: 26.0,
          cash: 65,
          change: 7,
        },
      ],
      // table
    };
    // return
  },
  // data
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  // computed
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    closeTransaction() {
      this.dialog = false;
    },
  },
  // methods
};
</script>
