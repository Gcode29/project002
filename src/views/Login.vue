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
            <v-form @submit.prevent="login">
              <v-text-field
                label="Email"
                name="email"
                v-model="email"
                prepend-inner-icon="mdi-mail"
              />
              <v-text-field
                label="Password"
                type="password"
                name="password"
                v-model="password"
                prepend-inner-icon="mdi-lock"
                suffix="| Forgot?"
              />
              <!-- <v-btn
              style="color: #ffffff"
              color="#065535"
              x-large
              block
              btn
              type="submit"
            >
              <span>Login</span>
            </v-btn> -->
              <a href="/dashboard">Login</a>
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
export default {
  name: "App",
  components: {
    ParticlesBg,
  },
};
</script>
