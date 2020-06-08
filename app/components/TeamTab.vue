<template>
	<FlexboxLayout class="component-container" flexDirection="column">
		<Label class="title" :text="teamInfo.teamName"></Label>
		<FlexboxLayout flexGrow="2" class="component-container" flexDirection="column" justifyContent="center">
			<FlexboxLayout class="row" justifyContent="space-between">
				<Label class="label-info" text="My distance: "></Label>
				<Label class="label-info" :text="participantInfo.distance / 1000 + ' km'"></Label>
			</FlexboxLayout>
			<FlexboxLayout class="row" justifyContent="space-between">
				<Label class="label-info" text="Players finished: "></Label>
				<Label class="label-info" :text="teamInfo.playersFinished - 1"></Label>
			</FlexboxLayout>
			<FlexboxLayout class="row" justifyContent="space-between">
				<Label class="label-info" text="Total team distance: "></Label>
				<Label class="label-info" :text="teamInfo.totalDistance / 1000 + ' km'"></Label>
			</FlexboxLayout>
			<FlexboxLayout class="row" justifyContent="space-between">
				<Label class="label-info" text="Team dist. remaining: "></Label>
				<Label class="label-info" :text="distanceRemaining"></Label>
			</FlexboxLayout>
		</FlexboxLayout>
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
		}
	},
	methods: {
		fetchTeamInfo() {
			request({
				url: this.$ngrokUrl + "/api/teams",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + appSettings.getString("accessToken")
				},
				content: JSON.stringify({
					accessToken: appSettings.getString("accessToken")
				})
			}).then(result => {
				result = result.content.toJSON();
				this.teamInfo = { ...result.teamInfo };
				//TODO: Edit below
				this.teamInfo.playersFinished = 2;
				this.participantInfo = { ...result.participantInfo };
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.component-container {
	margin-top: 15px;
}
.row {
	margin: 5% 10% 5% 10%;
}
.title {
	align-self: center;
	font-size: 40px;
	font-weight: bold;
}
.label-info {
	font-size: 18px;
}
</style>
