import { getJSON, getString, request, HttpResponse } from "tns-core-modules/http";
const appSettings = require("tns-core-modules/application-settings");

export default {
	methods: {
		async refreshAccessToken() {
			let result = await request({
				url: this.$ngrokUrl + "/api/auth/refresh_token",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + appSettings.getString("accessToken")
				},
				content: JSON.stringify({
					accessToken: appSettings.getString("accessToken"),
					refreshToken: appSettings.getString("refreshToken"),
					userId: appSettings.getNumber("userId")
				})
			});

			result = result.content.toJSON();
			if (!!result.accessToken) {
				appSettings.setString("accessToken", result.accessToken);
			}
		}
	}
};
