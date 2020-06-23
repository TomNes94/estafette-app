<template>
	<FlexboxLayout class="component-container" flexDirection="column" alignItems="center">
		<Label class="title" text="Tussenstand"></Label>
		<Label class="text-regular" text="Tap a row to see detailed stats!"></Label>
		<RadListView
			class="list"
			id="radListView"
			ref="listView"
			for="team in teamsArray"
			pullToRefresh="true"
			@itemTap="onItemTap"
			@pullToRefreshInitiated="onPullToRefreshInitiated"
		>
			<v-template name="header">
				<FlexboxLayout flexDirection="row" justifyContent="center" alignItems="center">
					<Label class="text-regular" text="Standings"></Label>
				</FlexboxLayout>
			</v-template>
			<v-template>
				<FlexboxLayout class="item" flexDirection="row" justifyContent="space-between">
					<!-- Shows the list item label in the default color and style. -->
					<Label class="text-regular" :text="team.teamName" />
					<Label class="text-regular" :text="Math.round(team.averageSpeed * 100) / 100 + ' km/h'" />
				</FlexboxLayout>
			</v-template>
		</RadListView>
	</FlexboxLayout>
</template>

<script>
import { getFile, getImage, getJSON, getString, request, HttpResponse } from "tns-core-modules/http";
import TeamModal from "./TeamModal";

export default {
	data() {
		return {
			teamsArray: [
				{
					teamName: null,
					averageSpeed: 0
				}
			],
			teamModal: TeamModal
		};
	},
	mounted() {
		this.updateList();
	},
	methods: {
		onItemTap(item) {
			let team = item.item;
			if (team.totalTimeTaken) {
				let hoursTaken = Math.floor(team.totalTimeTaken / 3600000);
				let minutesTaken = Math.round((team.totalTimeTaken % 3600000) / 60000);
				team.timeSpent = `${hoursTaken} hours and ${minutesTaken} minutes`;
			} else {
				team.timeSpent = 0;
			}

			this.$showModal(this.teamModal, {
				props: {
					teamName: team.teamName,
					distanceCovered: Math.round(team.distanceCovered * 10) / 10000 + " km",
					timeSpent: team.timeSpent,
					//TODO: change below
					//playersFinished: team.playersFinished,
					playersFinished: 2,
					place: 1
				}
			});
		},
		onPullToRefreshInitiated({ object }) {
			this.$nextTick(() => {
				this.updateList();
				object.notifyPullToRefreshFinished();
			});
		},
		updateList() {
			request({
				url: this.$ngrokUrl + "/api/teams/standings",
				method: "GET",
				headers: { "Content-Type": "application/json" }
			}).then(
				response => {
					let result = response.content.toJSON();
					result = result.map(team => {
						if (team.distanceCovered > 0) {
							team.averageSpeed = team.distanceCovered / 1000 / (team.totalTimeTaken / 3600000);
						} else {
							team.averageSpeed = 0;
						}
						return team;
					});
					this.teamsArray = result.sort((a, b) => {
						return b.averageSpeed - a.averageSpeed;
					});
				},
				e => {
					console.log(e);
				}
			);
		}
	}
};
</script>

<style lang="scss" scoped>
.component-container {
	width: 100%;
}

.title {
	font-size: 30px;
	color: white;
	font-weight: bold;
	margin-top: 5%;
}

.list {
	width: 90%;
	background-color: white;
}

.item {
	border: 1 solid black;
}

.text-regular {
	font-size: 18;
}
</style>
