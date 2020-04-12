<template>
    <Page>
        <ActionBar>
            <Label text="Home"></Label>
        </ActionBar>

        <GridLayout columns = "auto, auto, auto, *" rows = "auto, auto, auto, *">
            <Button row = "0" class="btn-location" text="Toon locatie" @tap="watchLocationAndUpdateJourney">
            </Button>
            <Label row = "1" col = "0" text="lat"></Label>
            <Label row = "1" col = "1" :text="origin.lat"></Label>
            <Label row = "1" col = "2" text="lng"></Label>
            <Label row = "1" col = "3" :text="origin.lng"></Label> 

            <Label row = "2" col = "0" text="hor_acc"></Label>
            <Label row = "2" col = "1" :text="horAccuracy"></Label> 
            <Label row = "2" col = "2" text="ver_acc"></Label>
            <Label row = "2" col = "3" :text="vertAccuracy"></Label>  

            <Label row = "3" col = "0" text="Distance"></Label>
            <Label row = "3" col = "1" :text="distance"></Label>
            <Label row = "3" col = "2" text="Last updated"></Label>
            <Label row = "3" col = "3" :text="lastUpdated"></Label>                                         
        </GridLayout>
    </Page>
</template>

<script>
import * as permissions from 'nativescript-permissions'
import * as platform from 'platform'
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import { getFile, getImage, getJSON, getString, request, HttpResponse } from "tns-core-modules/http";
    export default {
        data(){
            return {
                allowExecution: false,
                origin: {
                    lat: 0,
                    lng: 0
                },
                horAccuracy: null,
                vertAccuracy: null,
                speed: 0,
                lastUpdated: null,
                locations: [],
                distance: 0
            }
        },
        computed: {
            message() {
                return "Hallo moppie";
            }
        },
        created: function() {
            /* dont run the android permissions routine for iOS */
            if (platform.isIOS) {
                this.allowExecution = true;
                return;
            }
            /* list of permissions needed */
            let permissionsNeeded = [
                android.Manifest.permission.ACCESS_FINE_LOCATION,
                android.Manifest.permission.ACCESS_COARSE_LOCATION
            ];
            /* showing up permissions dialog */
            permissions
                .requestPermissions(permissionsNeeded, "Give it to me!")
                .then(() => this.allowExecution = true)
                .catch(() => this.allowExecution = false);
        },
        methods: {
            fetchMyLocation() {
                geolocation
                    .getCurrentLocation({
                        desiredAccuracy: Accuracy.high,
                        maximumAge: 1000,
                        timeout: 20000
                    })
                    .then(res => {
                        this.origin.lat = res.latitude;
                        this.origin.lng = res.longitude;
                    })
                    .catch(e => {
                        console.log("oh frak, error", e);
                    });
            },
            watchLocationAndUpdateJourney() {
            this.watch = geolocation.watchLocation(
                res => {
                    let lat = res.latitude;
                    let lng = res.longitude;
                    this.origin.lat = lat;
                    this.origin.lng = lng;
                    this.lastUpdated = res.timestamp
                    this.vertAccuracy = res.verticalAccuracy
                    this.horAccuracy = res.horizontalAccuracy
                    this.speed = res.speed
                    this.locations.push(res)

                    if(this.locations.length>1){
                        this.distance = this.distance + geolocation.distance(this.locations[this.locations.length - 1], this.locations[this.locations.length - 2]) 
                    }
                    
                    request({url: 'http:localhost:3000/data', 
                            method:"POST",
                            headers: { "Content-Type": "application/json" },
                            content: JSON.stringify({
                                lat: this.lat,
                                lng: this.lng
                            })}).then((response) => {
                                const result = response.content.toJSON();
                            }, (e) => { console.log(e)
                            });
                },
                error => console.log(error), {
                    desiredAccuracy: Accuracy.high,
                    updateDistance: 1,
                    updateTime: 500,
                    minimumUpdateTime: 500,
                    iosAllowsBackgroundLocationUpdates: true
                }
            );
        },
        },

    };
</script>

<style scoped lang="scss">
    
    Button{
        android-elevation: 4;
        width: 50%;
        background-color: white!important;
        border-color: darkolivegreen;
    }
    .info {
        font-size: 20;
        horizontal-align: center;
        vertical-align: center;
    }
</style>
