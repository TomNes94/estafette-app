<template>
	<GridLayout>
		<FlexboxLayout v-if="loading" class="progress-counter" flexDirection="column" justifyContent="center" alignItems="center">
			<ActivityIndicator :busy="loading"></ActivityIndicator>
			<Label text="GPS kalibreren!"></Label>
			<Progress width="100%" :value="initialCounts * 10" maxValue="100" />
		</FlexboxLayout>
		<GridLayout v-else>
			<FlexboxLayout class="component-container" flexDirection="column" justifyContent="center" alignItems="center" v-if="match.isStarted">
				<FlexboxLayout class="component-container" flexDirection="column" justifyContent="center" alignItems="center" v-if="!match.isEnded">
					<Label class="progress-counter" :text="match.progress + ' m'"></Label>
					<Label class="progress-counter" :text="match.speed + ' km/h '"></Label>
				</FlexboxLayout>
				<FlexboxLayout flexDirection="column" justifyContent="center" alignItems="center" v-else>
					<Label class="progress-counter" text="Finish bereikt!"></Label>
				</FlexboxLayout>
			</FlexboxLayout>
			<FlexboxLayout class="progress-counter" justifyContent="center" alignItems="center" v-else>
				<FlexboxLayout class="progress-counter" justifyContent="center" alignItems="center" v-if="participant.isFinished">
					<Button class="start-button" text="Start" @tap="startCounter"></Button>
				</FlexboxLayout>
				<FlexboxLayout class="progress-counter" justifyContent="center" alignItems="center" v-else>
					<Label class="progress-counter" :text="participant.status" textWrap="true"></Label>
				</FlexboxLayout>
			</FlexboxLayout>
		</GridLayout>
	</GridLayout>
</template>

<script>
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { getJSON, getString, request, HttpResponse } from "tns-core-modules/http";
const appSettings = require("tns-core-modules/application-settings");
import refreshAccessTokenMixin from "../utils/refreshAccessToken.js";

export default {
	data() {
		return {
			match: {
				progress: 0.0,
				speed: 0.0,
				isStarted: false,
				isEnded: false,
				timeStart: null
			},
			initialCounts: 0,
			locations: [],
			watchIds: [],
			loading: false,
			geoOptions: {
				desiredAccuracy: Accuracy.high,
				updateTime: 100,
				minimumUpdateTime: 100,
				iosAllowsBackgroundLocationUpdates: false
			},
			participant: {
				isFinished: false,
				status: null
			}
		};
	},
	async mounted() {
		this.fetchParticipantInfo();
		let isEnabled = await geolocation.isEnabled;
		if (!isEnabled) {
			geolocation.enableLocationRequest();
		}
	},
	mixins: [refreshAccessTokenMixin],
	methods: {
		startCounter() {
			this.loading = true;
			this.match.isStarted = true;
			this.initialCounts = 0;
			this.watchLocation();
		},

		async postProgress() {
			let result = await request({
				url: this.$ngrokUrl + "/api/progress/update_progress",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + appSettings.getString("accessToken")
				},
				content: JSON.stringify({
					accessToken: appSettings.getString("accessToken"),
					distanceCovered: this.match.progress,
					timeStart: this.match.timeStart
				})
			});
			result = result.content.toJSON();
			return result;
		},
		async onLocationHandler(loc) {
			if (this.initialCounts < 10) {
				this.initialCounts++;
				console.log(this.initialCounts);
				return;
			}
			this.match.timeStart = Date.now();
			this.loading = false;
			this.match.speed = Math.round(loc.speed * 360) / 100;
			this.locations.push(loc);
			if (this.locations.length > 1) {
				this.match.progress =
					Math.round((this.match.progress + geolocation.distance(this.locations[this.locations.length - 1], this.locations[this.locations.length - 2])) * 10) / 10;

				if (this.locations.length % 10 === 0) {
					let result = await this.postProgress();

					if (result.message === "Unauthorized!") {
						await this.refreshAccessToken();
						result = await this.postProgress();
						if (result.participantIsFinished) {
							this.match.isEnded = true;
							this.participant.isFinished = true;
							let watchId = this.watchIds[0];
							geolocation.clearWatch(watchId);
						}
					} else {
						if (result.participantIsFinished) {
							this.match.isEnded = true;
							let watchId = this.watchIds[0];
							geolocation.clearWatch(watchId);
						}
					}
				}
			}
		},
		watchLocation() {
			this.watchIds.push(
				geolocation.watchLocation(
					this.onLocationHandler,
					e => {
						console.log("Error middle: " + e.message);
					},
					this.geoOptions
				)
			);
		},

		async fetchParticipantInfo() {
			let response = await request({
				url: this.$ngrokUrl + "/api/participant",
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + appSettings.getString("accessToken")
				}
			});
			let result = response.content.toJSON();
			this.participant.isFinished = result.participantInfo.isFinished;

			if (this.participant.isFinished) {
				this.participant.status = "You have finished!";
			} else {
				this.participant.status = "Its go-time!";
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.component-container {
	background-color: rgba(200, 236, 243, 0.993);
	height: 100%;
	width: 100%;
}
.start-button {
	background-color: #eb6c05;
	width: 60%;
	border-radius: 15 15 15 15;
	border-color: #eb6c05;
	android-elevation: 8;
	border-width: 1;
	font-size: 30;
}
.row {
	margin: 5% 10% 5% 10%;
}
.progress-counter {
	font-size: 40px;
}
.loading-overlay {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgb(243, 243, 243);
}
</style>
