<template>
	<FlexboxLayout class="component-container" flexDirection="column">
		<Label class="title" :text="teamInfo.teamName"></Label>
		<PullToRefresh @refresh="refreshList">
			<ListView for="item in listInfo">
				<v-template>
					<FlexboxLayout height="150" class="row" justifyContent="space-between">
						<Label class="label-info" :text="item.label"></Label>
						<Label class="label-info" :text="item.value"></Label>
					</FlexboxLayout>
				</v-template>
			</ListView>
		</PullToRefresh>
	</FlexboxLayout>
</template>

<script>
import { getJSON, getString, request, HttpResponse } from "tns-core-modules/http";
const appSettings = require("tns-core-modules/application-settings");

export default {
	mounted() {
		this.fetchTeamInfo();
	},
	data() {
		return {
			teamInfo: {
				teamName: null,
				totalDistance: null,
				isStarted: null,
				isFinished: null
			},
			participantInfo: { id: null }
		};
	},
	computed: {
		distanceRemaining() {
			return Math.round((this.teamInfo.totalDistance - this.teamInfo.distanceCovered) / 100) / 10 + " km";
		},
		listInfo() {
			return [
				{
					label: "My distance: ",
					value: this.participantInfo.distance / 1000 + " km"
				},
				{
					label: "My average speed: ",
					value:
						this.participantInfo.distanceCovered === null
							? 0 + "km/h"
							: Math.round((this.participantInfo.distanceCovered / 1000 / (this.participantInfo.timeTaken / 360000)) * 1000) / 100 + " km/h"
				},
				{
					label: "Players finished: ",
					value: this.teamInfo.totalParticipantsFinished
				},
				{
					label: "Total team distance: ",
					value: this.teamInfo.totalDistance / 1000 + " km"
				},
				{
					label: "Team dist. remaining: ",
					value: Math.round((this.teamInfo.totalDistance - this.teamInfo.distanceCovered) / 100) / 10 + " km"
				},
				{
					label: "Team average speed: ",
					value:
						this.teamInfo.distanceCovered === null || this.teamInfo.distanceCovered === 0
							? 0 + "km/h"
							: Math.round((this.teamInfo.distanceCovered / 1000 / (this.teamInfo.totalTimeTaken / 360000)) * 1000) / 100 + " km/h"
				}
			];
		}
	},
	methods: {
		async refreshList(args) {
			const pullRefresh = args.object;
			await this.fetchTeamInfo();
			pullRefresh.refreshing = false;
		},
		async fetchTeamInfo() {
			let result = await request({
				url: this.$ngrokUrl + "/api/teams",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + appSettings.getString("accessToken")
				},
				content: JSON.stringify({
					accessToken: appSettings.getString("accessToken")
				})
			});
			result = result.content.toJSON();
			this.teamInfo = { ...result.teamInfo };
			this.participantInfo = { ...result.participantInfo };

			return;
		}
	}
};
</script>

<style lang="scss" scoped>
.component-container {
	background-image: url("~/images/background.png");
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	height: 100%;
}
.row {
	margin: 5% 10% 5% 10%;
}
.title {
	align-self: center;
	font-size: 40px;
	font-weight: bold;
	height: 20%;
}
.label-info {
	font-size: 18px;
}
</style>
