<template>
  <div>
    <particles-bg
      type="cobweb"
      color="#008080"
      :bg="true"
      style="background-color: #133337"
    />
    <v-container>
      <v-col align="center" justify="center" cols="12">
        <v-card max-width="374" style="margin-top: 60px" class="pa-2">
          <template slot="progress">
            <v-progress-linear
              color="deep-purple"
              height="10"
              indeterminate
            ></v-progress-linear>
          </template>

          <v-img
            :src="require('../assets/logo.png')"
            class="my-3"
            contain
            height="250"
          />

          <v-card-text>
            <v-alert v-if="error" color="#D50000" dense outlined type="error">
              <!-- <strong>Invalid</strong> Credentials  -->
              These credentials do not match our records.
            </v-alert>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                label="Email"
                name="email"
                v-model="form.email"
                prepend-inner-icon="mdi-mail"
              />
              <v-text-field
                label="Password"
                type="password"
                name="password"
                v-model="form.password"
                prepend-inner-icon="mdi-lock"
                suffix="| Forgot?"
              />
              <v-btn
                @click.prevent="onSubmit"
                :loading="loading"
                style="color: #ffffff"
                color="#065535"
                x-large
                block
                btn
                type="submit"
              >
                <span>Login</span>
              </v-btn>
            </v-form>
            <v-card-actions>
              <v-checkbox color="" label="Remember me"></v-checkbox>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import { ParticlesBg } from "particles-bg-vue";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    ParticlesBg,
  },

  data() {
    return {
      loading: false,
      error: false,

      form: {
        email: "",
        password: "",
        device_name: "browser",
      },
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),

    async onSubmit() {
      this.error = null;
      this.loading = true;
      try {
        await this.login(this.form);
        this.loading = false;
        this.$router.push("/dashboard");
      } catch (error) {
        this.error = true;
        this.loading = false;
      }
    },
  },
};
</script>
