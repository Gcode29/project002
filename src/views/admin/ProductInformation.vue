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
      <span v-if="success_add">Category Successfully Created</span>

      <span v-if="success_update">Category Successfully Updated</span>

      <span v-if="success_delete">Category Successfully Deleted</span>

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
            <h3>Product Manager</h3>

            <!-- dialog -->
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
                    <span class="text-h5">Product Information</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            label="Product Name*"
                            required
                            :rules="ProductNameRule"
                            v-model="form.product_name"
                          />
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            label="Product Code"
                            v-model="form.product_code"
                          />
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            label="Product Brand"
                            v-model="form.product_brand"
                          />
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            label="Price*"
                            :rules="PriceRule"
                            v-model="form.price"
                          />
                        </v-col>
                        <v-col cols="4">
                          <v-text-field label="Color" v-model="form.color" />
                        </v-col>
                        <v-col cols="4">
                          <v-text-field label="Size" v-model="form.size" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                          <v-select
                            :items="[
                              'Pc/s',
                              'Gram',
                              'Gal',
                              'Lit',
                              'Bag',
                              'Ft',
                              'Kl',
                              'Pack',
                            ]"
                            label="Unit of Measure"
                            required
                            :rules="UomRule"
                            v-model="form.uom"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                          <v-autocomplete
                            auto-select-first
                            clearable
                            dense
                            filled
                            solo
                            label="Category"
                            :items="allCategories"
                            return-object
                            item-value="id"
                            item-text="category_name"
                            v-model="form.category"
                            @change="loadSubCategory(form.category.id)"
                            required
                          ></v-autocomplete
                        ></v-col>
                        <v-col cols="12" lg="4" md="4">
                          <v-autocomplete
                            solo
                            v-model="form.subcategory"
                            auto-select-first
                            clearable
                            dense
                            filled
                            label="Sub Category"
                            :items="categorysubdata"
                            return-object
                            item-value="id"
                            item-text="subcategory_name"
                          />
                        </v-col>
                      </v-row>
                      <div v-show="!editmode">
                        <v-divider class="mb-5 mt-5"></v-divider>
                        <span>Inital Stock Details</span>
                        <v-row class="mt-2">
                          <v-col cols="6">
                            <v-text-field
                              label="Quantity"
                              v-model="form.quantity"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                              label="Price"
                              v-model="form.inv_price"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </div>
                    </v-container>
                    <v-divider v-if="editmode"></v-divider>
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
          <!-- dialog -->

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
            :items="allProducts"
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
                @click="deleteProductMeth(item.id)"
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

      // Rules Validation
      ProductNameRule: [(v) => !!v || "Product Name is required"],
      PriceRule: [(v) => !!v || "Price is required"],
      UomRule: [(v) => !!v || "Unit of Measure is required"],
      CategoryRule: [(v) => !!v || "Category is required"],
      // Rules Validation

      // form
      form: {
        quantity: "",
        product_name: "",
        product_code: "",
        category: "",
        subcategory: "",
        brand: "",
        price: "",
        color: "",
        size: "",
        uom: "",
        inv_price: "",
      },
      // form

      // table
      search: "",
      headers: [
        {
          text: "Product Name",
          align: "start",
          filterable: false,
          value: "product_name",
        },
        { text: "Category", value: "category.category_name" },
        { text: "Sub-Category", value: "sub_category.subcategory_name" },
        { text: "Brand", value: "brand" },
        { text: "Color", value: "color" },
        { text: "Size", value: "size" },
        { text: "Unit of Measure", value: "uom" },
        { text: "Action", value: "actions" },
      ],
      // table
    };
  },
  // data

  methods: {
    New() {
      this.editmode = false;
      this.dialog = true;
      this.id = "";
    },

    Close() {
      this.editmode = false;
      this.dialog = false;
      this.$refs.form.reset();
      this.id = "";
    },

    loadSubCategory(id) {
      try {
        this.getCategorySub(id);
      } catch (err) {
        this.snackbar2 = true;
        console.log(err);
      }
    },

    async Save() {
      this.$refs.form.validate();
      this.loading1 = true;
      try {
        await this.addProduct(this.form);
        this.success_add = true;
        this.snackbar = true;
        this.loading1 = false;
        this.Close();
        this.getProducts();
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
        await this.updateProduct(this.form);
        this.success_update = true;
        this.snackbar = true;
        this.loading1 = false;
        this.Close();
        this.getProducts();
      } catch (err) {
        this.snackbar2 = true;
        this.loading1 = false;
        console.log(err);
      }
    },

    deleteProductMeth(id) {
      this.loading1 = true;
      if (confirm("Are you sure you want to Remove this Product?")) {
        this.loading1 = false;
        this.success_delete = true;
        this.snackbar = true;
        this.deleteProduct(id);
      }

      this.loading1 = false;
    },
    edit(item) {
      this.editmode = true;
      this.dialog = true;

      this.form = {
        id: item.id,
        product_name: item.product_name,
        product_code: item.product_code,
        category: item.category,
        subcategory: item.subcategory,
        brand: item.brand,
        price: item.price,
        color: item.color,
        size: item.size,
        uom: item.uom,
      };
      this.loadSubCategory(item.category.id);
    },

    ...mapActions("products", [
      "getProducts",
      "deleteProduct",
      "updateProduct",
      "addProduct",
      "getCategorySub",
    ]),

    ...mapActions("categories", ["getCategories"]),
    ...mapActions("subcategories", ["getCategorySub"]),
  },
  // methods

  computed: {
    ...mapGetters("products", ["allProducts"]),
    ...mapGetters("categories", ["allCategories"]),
    ...mapGetters("subcategories", ["categorysubdata"]),
  },
  // computed

  async mounted() {
    await this.getProducts();
    await this.getCategories();
  },
};
</script>
