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
      <span v-if="success_add">Save Successfully</span>

      <span v-if="success_update">Update Successfully</span>

      <span v-if="success_delete">Deleted Successfully</span>

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
          <div class="d-flex justify-space-around mb-3" flat tile>
            <div class="pa-2 mr-auto mt-3 ml-3">
              <h3>Deliveries</h3>
            </div>
            <div class="pa-2 mt-3">
              <v-btn
                color="#26A69A"
                class="pa-2 rounded-lg"
                dark
                @click="NewIn()"
              >
                In Delivery
                <v-icon class="ml-1">mdi-truck-plus-outline</v-icon>
              </v-btn>
            </div>
            <div class="pa-2 mt-3 mr-3">
              <v-btn
                color="#4FC3F7"
                class="pa-2 rounded-lg"
                dark
                @click="NewOut()"
              >
                Out Delivery
                <v-icon class="ml-1">mdi-truck-delivery-outline</v-icon>
              </v-btn>
            </div>
          </div>

          <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-card
              ><v-toolbar dark color="primary">
                <v-btn icon dark @click="Close()">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Input Items</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn dark text @click="transationComplete"> Save </v-btn>
                </v-toolbar-items>
              </v-toolbar>

              <v-container>
                <v-row>
                  <!-- DELIVERY IN -->
                  <v-col cols="12" lg="6" md="6" v-if="transactionmode === 1">
                    <v-form ref="form" v-model="valid">
                      <v-row class="mb-2">
                        <v-col cols="8">
                          <v-autocomplete
                            auto-select-first
                            clearable
                            label="Employee Checker"
                            :items="allEmployees"
                            :rules="nameRules"
                            return-object
                            item-value="id"
                            item-text="fullname"
                            v-model="form.employee"
                          />
                        </v-col>
                        <v-col cols="4"
                          ><v-select
                            :items="allBranches"
                            v-model="form.branch"
                            item-value="id"
                            item-text="branch_name"
                            label="Warehouse*"
                            :rules="nameRules"
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            auto-select-first
                            clearable
                            label="Product*"
                            :items="allProducts"
                            :rules="nameRules"
                            item-value="id"
                            item-text="uniquename"
                            v-model="form.product"
                            @change="fillForm(form.product)"
                            return-object
                            validate-on-blur
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="form.price"
                            label="Price*"
                            type="number"
                            required
                            :rules="nameRules"
                            validate-on-blur
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
                            validate-on-blur
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
                            validate-on-blur
                          />
                        </v-col>
                        <v-col cols="12" lg="6" md="6">
                          <v-text-field
                            v-model="form.totalamount"
                            label="Total Amount*"
                            readonly
                            disabled
                            required
                            :rules="nameRules"
                            validate-on-blur
                          />
                        </v-col>
                        <small>*indicates required field</small>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="Close()">
                          Close
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="addItem()">
                          Add
                        </v-btn>
                      </v-row>
                      <v-divider></v-divider>
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
                  <!-- DELIVERY IN -->
                </v-row>
              </v-container>
            </v-card>
          </v-dialog>

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
            :items="allDeliveries"
            :items-per-page="10"
            :search="search"
          >
            <template v-slot:item.delivery_id="{ item }">
              <a href="#" @click="viewDelivery(item.delivery_id)">{{
                item.delivery_id
              }}</a>
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip :color="getColor(item.status)" dark>
                <div v-if="item.status === 1">Inbound</div>
                <div v-if="item.status === 2">Outbound</div>
              </v-chip>
            </template>
            <template v-slot:item.test="{ item }">
              <v-icon
                color="#D50000"
                class="mr-2"
                @click="openDeleteDialog(item.delivery_id)"
              >
                mdi-archive-remove
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
          <span class="white--text">Delivery ID : {{ idHeader }}</span>
        </v-card-title>

        <v-card-text class="mt-5">
          <v-data-table
            dense
            :headers="headers2"
            :items="deliveryData"
            item-key="name"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:item.actions="{ item }">
              <Form :selected="item" />
              <v-btn class="success mb-2 mt-1 mr-2" @click="edit(item)"
                ><v-icon>mdi-clipboard-text-search-outline</v-icon></v-btn
              >
              <v-btn
                class="red mb-2 mt-1 white--text"
                @click="deleteDeliveryProduct(item.id)"
                ><v-icon>mdi-clipboard-remove-outline</v-icon></v-btn
              >
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" text @click="dialog2 = false"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialog2 -->

    <!-- DELETE DELIVERY (Dialog3) -->
    <v-dialog v-model="dialog3" persistent max-width="360">
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
          <v-btn color="red darken-1" text @click="dialog3 = false">
            Disagree
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="removeDelivery(id)">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- DELETE DELIVERY (Dialog3) -->

    <!-- EDIT PRODUCT DELIVERY (Dialog4) -->
    <v-row justify="center">
      <v-dialog v-model="dialog4" persistent max-width="600px">
        <v-card>
          <v-form ref="form" v-model="valid_UpdateProduct" lazy-validation>
            <v-card-title class="text-h5 teal lighten-2">
              <span class="white--text">Delivery ID : {{ idHeader }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Product Name"
                      disabled
                      v-model="form.updateProductName"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      label="Price"
                      required
                      :rules="nameRules"
                      @input="getTotalAmount2"
                      @change="getTotalAmount2"
                      v-model="form.updatePrice"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      label="Quantity"
                      @input="getTotalAmount2"
                      @change="getTotalAmount2"
                      :rules="nameRules"
                      v-model="form.updateQuantity"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      label="Total Price"
                      v-model="form.updateTotalPrice"
                      disabled
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="CloseUpdate()">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="updateComplete()">
                Save
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- EDIT PRODUCT DELIVERY (Dialog4) -->
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      valid_UpdateProduct: false,
      idHeader: "",
      transactionmode: 1,
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
      loading1: false,
      //   loading bar

      // form
      Pr_Quantity: "",
      Pr_Productname: "",
      transactions: [],

      nameRules: [(v) => !!v || "Required*"],

      categories: [],
      form: {
        status: "",
      },

      // table
      expanded: [],
      singleExpand: false,
      search: "",
      headers: [
        {
          text: "Delivery ID",
          align: "start",
          filterable: true,
          value: "delivery_id",
        },
        { text: "Status", value: "status" },
        { text: "No. of Products", value: "ItemsCount" },
        { text: "Total Products Count", value: "quantity" },
        { text: "Total Amount (₱)", value: "price" },
        { text: "Action", value: "test" },
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
          value: "uniquename",
        },
        { text: "Quantity", value: "quantity" },
        { text: "Price", value: "price" },
        { text: "Total Price", value: "total_price" },
        { text: "Action", value: "actions" },
      ],

      // table2
    };
  },
  // data

  computed: {
    ...mapGetters("employees", ["allEmployees"]),
    ...mapGetters("products", ["allProducts"]),
    ...mapGetters("deliveries", ["allDeliveries", "deliveryData"]),
    ...mapGetters("branches", ["allBranches"]),

    total() {
      let total = 0;
      this.transactions.map(
        (transaction) => (total += transaction.totalamount)
      );
      return total;
    },
  },
  // computed

  async mounted() {
    await this.getDeliveries();
  },

  methods: {
    ...mapActions("employees", ["getEmployee"]),
    ...mapActions("products", ["getProducts"]),
    ...mapActions("branches", ["getBranches"]),

    ...mapActions("deliveries", [
      "getDeliveries",
      "getDeliveryData",
      "addDelivery",
      "deleteDelivery",
      "updateDelivery",
    ]),

    async NewIn() {
      this.transactionmode = 1;
      this.form.status = "1";
      this.dialog = true;

      await this.getEmployee();
      await this.getProducts();
      await this.getBranches();
    },

    async NewOut() {
      this.transactionmode = 2;
      this.form.status = "2";
      this.dialog = true;

      await this.getEmployee();
      await this.getProducts();
      await this.getBranches();
    },

    Close() {
      this.dialog = false;

      this.$refs.form.reset();

      this.clearForm();
      this.form.status = "";
      this.form.employee = "";
      this.transactions = [];
    },

    CloseUpdate() {
      this.dialog4 = false;

      this.$refs.form.reset();
      this.id = "";
    },

    clearForm() {
      this.form.price = "";
      this.form.uom = "";
      this.form.product = "";
      this.form.quantity = "";
      this.form.totalamount = "";
      // this.form.getBranches = "";
      // this.form.status = "";
      // this.form.employee = "";
    },

    fillForm(products) {
      (this.form.uom = products.uom), (this.form.price = products.price);
    },

    getTotalAmount() {
      this.form.totalamount = +this.form.price * +this.form.quantity;
    },

    getTotalAmount2() {
      this.form.updateTotalPrice =
        +this.form.updatePrice * +this.form.updateQuantity;
    },

    addItem() {
      if (this.$refs.form.validate() === true) {
        this.transactions.push({
          price: this.form.price,
          uom: this.form.uom,
          product_id: this.form.product.id,
          product_name: this.form.product.uniquename,
          quantity: this.form.quantity,
          totalamount: this.form.totalamount,
        });
        this.loading = false;
        this.clearForm();
      }
    },

    removeItem(index) {
      this.transactions.splice(index, 1);
    },

    async transationComplete() {
      this.loading = true;
      this.transactions.map((transaction) => {
        transaction.del_stat = this.form.status;
        transaction.grand_total = this.total;
        transaction.branch_id = this.form.branch;
        transaction.employee = this.form.employee.id;
        return transaction;
      });

      try {
        await this.addDelivery(this.transactions);
        this.success_add = true;
        this.snackbar = true;
        this.loading1 = false;
        this.Close();
        this.getDeliveries();
      } catch (err) {
        this.snackbar2 = true;
        console.log(err);
        this.loading1 = false;
      }
    },

    removeDelivery(id) {
      this.loading1 = false;
      this.success_delete = true;
      this.snackbar = true;
      this.deleteDelivery(id);
      this.getDeliveries();
      this.dialog3 = false;
    },

    viewDelivery(delivery_id) {
      this.getDeliveryData(delivery_id);
      this.dialog2 = true;
      this.idHeader = delivery_id;
      console.log(delivery_id);
    },

    edit(item) {
      this.dialog4 = true;
      console.log(item);
      this.form = {
        id: item.id,
        updateTotalPrice: item.total_price,
        updatePrice: item.price,
        updateQuantity: item.quantity,
        updateProductName: item.uniquename,
      };
    },

    async updateComplete() {
      this.$refs.form.validate();
      this.loading1 = true;
      console.log(this.form);

      try {
        await this.updateDelivery(this.form);
        this.success_update = true;
        this.snackbar = true;
        this.loading1 = false;
        this.dialog2 = false;
        this.getDeliveries();
        this.CloseUpdate();
      } catch (err) {
        this.snackbar2 = true;
        this.loading1 = false;
        console.log(err);
      }
    },

    deleteDeliveryProduct() {
      //
    },

    getColor(status) {
      if (status === 2) return "red";
      else return "green";
    },
    openDeleteDialog(delivery_id) {
      this.id = delivery_id;
      this.loading1 = true;
      this.dialog3 = true;
    },
  },
};
</script>
