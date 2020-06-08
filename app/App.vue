<template>
	<Navigator :defaultRoute="isLoggedIn ? '/main' : '/login'" />
</template>

<script>
const appSettings = require("tns-core-modules/application-settings");
const jwtDecode = require("jwt-decode");

export default {
	computed: {
		isLoggedIn() {
			if (!!appSettings.getString("accessToken")) {
				const decodedJWT = jwtDecode(appSettings.getString("accessToken"));
				return parseInt(decodedJWT.exp) * 1000 > Date.now() ? true : false;
			} else return false;
		}
	}
};
</script>

<style>
body {
	font-family: "Poppins Regular", "Poppins-Regular", "Poppins Black", "Poppins-Black", "Poppins-Bold", "Poppins Bold", Arial, Helvetica, sans-serif;
}
</style>
