<template>
	<Page class="page" actionBarHidden="true">
		<BottomNavigation selectedIndex="0">
			<TabStrip>
				<TabStripItem>
					<Label text="Home"></Label>
					<Image src="~/images/house-user-solid.png" stretch="aspectFit"></Image>
				</TabStripItem>
				<TabStripItem>
					<Label text="Team"></Label>
					<Image src="~/images/users-cog-solid.png" stretch="aspectFit"></Image>
				</TabStripItem>
				<TabStripItem>
					<Label text="Stand"></Label>
					<Image src="~/images/flag-checkered-solid.png" stretch="aspectFit"></Image>
				</TabStripItem>
				<TabStripItem>
					<Label text="Wedstrijd"></Label>
					<Image src="~/images/running-solid.png" stretch="aspectFit"></Image>
				</TabStripItem>
			</TabStrip>
			<TabContentItem>
				<HomeTab />
			</TabContentItem>
			<TabContentItem>
				<TeamTab />
			</TabContentItem>
			<TabContentItem>
				<StandingsTab />
			</TabContentItem>
			<TabContentItem>
				<MatchTab />
			</TabContentItem>
		</BottomNavigation>
	</Page>
</template>

<script>
import HomeTab from "./HomeTab";
import TeamTab from "./TeamTab";
import MatchTab from "./MatchTab";
import StandingsTab from "./StandingsTab";
export default {
	components: {
		HomeTab,
		MatchTab,
		TeamTab,
		StandingsTab
	}
};
</script>

<style scoped lang="scss">
.page {
	font-family: "Poppins Regular", "Poppins-Regular", "Poppins Black", "Poppins-Black", "Poppins-Bold", "Poppins Bold", Arial, Helvetica, sans-serif;
}
.fab {
	font-family: "Font Awesome 5 Brands", "fa-brands-400";
	font-weight: 400;
}
.logo-small {
	width: 100%;
}
</style>
