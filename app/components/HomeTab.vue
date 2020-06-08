<template>
	<FlexboxLayout class="component-container" flexDirection="column" alignItems="center" justifyContent="center">
		<Image class="img" :src="$ngrokUrl + '/assets/aclo_logo.png'"></Image>
		<Label class="text-regular" :text="teamNumberFormattedString"></Label>
		<Label class="text-regular" :text="dateStartFormattedString"></Label>
	</FlexboxLayout>
</template>

<script>
import * as permissions from "nativescript-permissions";
import * as platform from "platform";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import { getFile, getImage, getJSON, getString, request, HttpResponse } from "tns-core-modules/http";
export default {
	data() {
		return {
			allowExecution: false,
			match: {
				dateStart: null,
				numberOfTeams: null,
				title: null
			}
		};
	},
	computed: {
		teamNumberFormattedString() {
			return `There are ${this.match.numberOfTeams} teams competing!`;
		},
		dateStartFormattedString() {
			let hoursRemaining = Math.floor((new Date("2020-06-27T08:00:00.000Z") - Date.now()) / 360000);
			return `Only ${hoursRemaining} hours until ${this.match.title} starts!`;
		}
	},
	created: function() {
		/* dont run the android permissions routine for iOS */
		if (platform.isIOS) {
			geolocation.enableLocationRequest();
			this.allowExecution = true;
		} else {
			/* list of permissions needed */
			let permissionsNeeded = [android.Manifest.permission.ACCESS_FINE_LOCATION, android.Manifest.permission.ACCESS_COARSE_LOCATION];
			/* showing up permissions dialog */
			permissions
				.requestPermissions(permissionsNeeded, "Je locatie is nodig voor deze app.")
				.then(() => (this.allowExecution = true))
				.catch(() => (this.allowExecution = false));
		}
	},
	mounted() {
		request({
			url: this.$ngrokUrl + "/api/matches",
			method: "GET",
			headers: { "Content-Type": "application/json" }
		}).then(
			response => {
				const result = response.content.toJSON();
				this.match.numberOfTeams = result.numberOfTeams;
				this.match.title = result.name;
				this.match.dateStart = result.dateStart;
			},
			e => {
				console.log(e);
			}
		);
	},
	methods: {}
};
</script>

<style scoped lang="scss">
.text-regular {
	font-size: 18px;
}
.component-container {
	border: 2px solid #eb6c05;
	box-sizing: border-box;
}
.icon {
	width: 70%;
}
</style>
