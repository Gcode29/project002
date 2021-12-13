<template>
  <v-container
    id="user-profile-view"
    fluid
    tag="section"
    style="margin-top: 50px"
  >
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="align-start">
          <v-img
            class="elevation-6 mt-n12 d-inline-block ml-5"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvqw0-Odjoe0-mAUUo8tjYuQK-1F5LBIoNRA&usqp=CAU"
            width="128"
            height="128"
          />
          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" md="4">
                  <!-- <v-text-field v-model="data.user.Fname" /> -->
                  <v-text-field label="firstname"/>
                </v-col>

                <v-col cols="12" md="4">
                  <!-- <v-text-field v-model="data.user.Mname" /> -->
                   <v-text-field label="middlename"/>
                </v-col>

                <v-col cols="12" md="4">
                  <!-- <v-text-field v-model="data.user.Lname" /> -->
                   <v-text-field label="lastname"/>
                </v-col>

                <v-col cols="12">
                  <!-- <v-text-field v-model="data.user.email" /> -->
                   <v-text-field label="email@email.com"/>
                </v-col>

                

                <v-col cols="12">
                  <span>Change Password</span>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="Password" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="Confirm Password" type="number" />
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn color="primary" min-width="150">
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>