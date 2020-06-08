<template>
	<Page class="page" actionBarHidden="true">
		<FlexboxLayout class="component-container" flexDirection="column">
			<FlexboxLayout class="block" flexDirection="column" border marginTop="10" marginBottom="10">
				<Label class="header" alignSelf="center">{{ teamName }}</Label>
			</FlexboxLayout>
			<FlexboxLayout class="block" flexDirection="column" marginTop="10" marginBottom="10">
				<Label class="text-regular title">Distance covered</Label>
				<Label class="text-regular" alignSelf="flex-end">{{ distanceCovered }}</Label>
			</FlexboxLayout>
			<FlexboxLayout class="block" flexDirection="column" marginTop="10" marginBottom="10">
				<Label class="text-regular title">Time running</Label>
				<Label class="text-regular" alignSelf="flex-end">{{ timeSpent }}</Label>
			</FlexboxLayout>
			<FlexboxLayout class="block" flexDirection="column" marginTop="10" marginBottom="10">
				<Label class="text-regular title">Players finished</Label>
				<Label class="text-regular" alignSelf="flex-end">{{ playersFinished }}</Label>
				<Button @tap="$modal.close" alignSelf="flex-end" justifySelf="flex-end" text="Close" />
			</FlexboxLayout>
		</FlexboxLayout>
	</Page>
</template>

<script>
export default {
	props: ["teamName", "distanceCovered", "timeSpent", "playersFinished", "place"]
};
</script>

<style lang="scss" scoped>
.page {
	width: 100%;
	padding: 0;
	margin: 0;
}
.component-container {
	width: 100%;
	height: 60%;
	font-family: "Poppins Regular", "Poppins-Regular", "Poppins Black", "Poppins-Black", "Poppins-Bold", "Poppins Bold", Arial, Helvetica, sans-serif;
}
.text-regular {
	font-size: 14;
	margin-left: 5;
	margin-right: 5;
}
.title {
	font-weight: bold;
}

.header {
	font-size: 22;
}
.block {
	border-width: 0;
	border-radius: 0;
	border-bottom-width: 1;
	border-color: black;
}
</style>
