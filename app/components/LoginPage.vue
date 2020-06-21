<template>
	<Page class="page" actionBarHidden="true">
		<FlexboxLayout flexDirection="column" class="container-stack-layout" alignItems="center" v-if="!showRegistrationFormBool">
			<Image class="logo" :src="$ngrokUrl + '/assets/aclo_logo.png'"></Image>
			<StackLayout class="input-field" marginBottom="25">
				<TextField
					class="input"
					hint="Email"
					keyboardType="email"
					autocorrect="false"
					autocapitalizationType="none"
					v-model="user.email"
					returnKeyType="next"
					@returnPress="focusPassword"
					fontSize="18"
				/>
				<StackLayout class="hr-light" />
			</StackLayout>
			<StackLayout class="input-field" marginBottom="10">
				<TextField ref="password" class="input" hint="Password" secure="true" v-model="user.password" returnKeyType="done" fontSize="18" />
				<StackLayout class="hr-light" />
			</StackLayout>
			<Button text="Log In" @tap="submit" class="btn" />
			<Button text="Register" @tap="showRegistrationForm(true, null)" class="btn" />
			<ActivityIndicator :busy="showLoadingIndicator"></ActivityIndicator>
		</FlexboxLayout>
		<FlexboxLayout flexDirection="column" alignItems="center" justifyContent="center" class="container-stack-layout" v-else>
			<StackLayout class="input-field" marginBottom="10">
				<TextField
					class="input"
					hint="Email"
					keyboardType="email"
					autocorrect="false"
					autocapitalizationType="none"
					v-model="newuser.email"
					returnKeyType="next"
					@returnPress="focusPassword"
					fontSize="18"
				/>
				<StackLayout class="hr-light" />
			</StackLayout>
			<StackLayout class="input-field" marginBottom="10">
				<TextField ref="newpassword" class="input" hint="Password" secure="true" v-model="newuser.password" returnKeyType="done" fontSize="18" />
				<StackLayout class="hr-light" />
			</StackLayout>
			<Button text="Register!" @tap="registerNewUser" class="btn" />
			<Button text="Back to login" @tap="showRegistrationForm(false, newuser.email)" class="btn" />
		</FlexboxLayout>
	</Page>
</template>

<script>
const appSettings = require("tns-core-modules/application-settings");
const jwtDecode = require("jwt-decode");
const Toast = require("nativescript-toast");
import MainPage from "./MainPage";

import { getJSON, getString, request, HttpResponse } from "tns-core-modules/http";
export default {
	data() {
		return {
			user: {
				email: "",
				password: ""
			},
			newuser: {
				email: "",
				password: "",
				passwordCheck: null
			},
			showRegistrationFormBool: false,
			showLoadingIndicator: false
		};
	},
	methods: {
		focusPassword() {
			this.$refs.password.nativeView.focus();
		},
		async submit() {
			this.showLoadingIndicator = true;
			try {
				if (this.user.email === "debug") {
					this.$navigateTo(MainPage);
					return;
				}

				let response = await fetch(this.$ngrokUrl + "/api/auth/signin", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						emailAddress: this.user.email,
						password: this.user.password
					})
				});

				const result = await response.json();

				if (result.status === 401) {
					Toast.makeText("Login failed! Did you already register?", "long");
				} else {
					console.log(result);
					this.showLoadingIndicator = false;
					appSettings.setString("accessToken", result.accessToken);
					appSettings.setString("refreshToken", result.refreshToken);
					appSettings.setNumber("userId", result.userId);
					this.$navigateTo(MainPage);
				}
			} catch (error) {
				console.log(error);
			}
		},
		registerNewUser() {
			request({
				url: this.$ngrokUrl + "/api/auth/signup",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				content: JSON.stringify({
					emailAddress: this.newuser.email,
					password: this.newuser.password,
					deviceToken: appSettings.getString("deviceToken")
				})
			}).then(
				response => {
					const result = response.content.toJSON();
					this.showRegistrationFormBool = false;
				},
				e => {
					Toast.makeText("Login failed! Did you already register?");
				}
			);
		},
		showRegistrationForm(state, email) {
			this.showRegistrationFormBool = state;
			if (email) this.user.email = email;
		}
	}
};
</script>

<style scoped>
.container-stack-layout {
	height: 100%;
}
.input-field {
	width: 70%;
	margin-top: 0;
	margin-bottom: 2;
}

.input {
	font-size: 14;
}
.page {
	height: 100%;
	font-family: "Poppins Regular", "Poppins-Regular", "Poppins Black", "Poppins-Black", "Poppins-Bold", "Poppins Bold", Arial, Helvetica, sans-serif;
}
.logo {
	width: 90%;
	margin-top: 0;
	margin-bottom: 0;
}

.btn {
	background-color: #eb6c05;
	width: 60%;
	border-radius: 15 15 15 15;
	border-color: #eb6c05;
	android-elevation: 8;
	border-width: 1;
}

.btn:highlighted {
	background-color: #eb6d059c;
}
</style>
