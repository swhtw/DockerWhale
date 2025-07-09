<template>
    <!-- title and search bar, at the same hight level-->
    <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- title of this page -->
        <div>
            <h3>Home Page</h3>
        </div>
    </div>
    <!-- give me a 3 columns * 2 rows blocks -->
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <div class="card" style="width: 18rem; height: 15rem;">
                    <div class="card-body">
                        <h5 class="card-title">Container</h5>
                        <p class="card-text">Running: {{ info.ContainersRunning }}</p>
                        <p class="card-text">Paused: {{ info.ContainersPaused }}</p>
                        <p class="card-text">Stopped: {{ info.ContainersStopped }}</p>
                        <router-link to="/containers" class="card-link">Details</router-link>
                    </div>
                </div>
            </div>
            <div class="col-sm">
                <div class="card" style="width: 18rem; height: 15rem;;">
                    <div class="card-body">
                        <h5 class="card-title">Images</h5>
                        <p class="card-text">Total: {{ info.Images }}</p>
                        <router-link to="/images" class="card-link">Details</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// load the docker info from the API
import axios from "axios";
const API_URL = process.env.VUE_APP_BACKEND_URL;
export default {
    name: "HomePage",
    data() {
        return {
            info: {}, // Array to hold the images fetched from the API
        };
    },
    mounted() {
        this.fetchInfo();
    },
    methods: {
        async fetchInfo() {
            try {
                // Fetch info from the API
                console.log("Fetching info from API...");
                const url = `${API_URL}/info`;
                console.log("API URL:", url);
                const response = await axios.get(url);
                console.log("Response from API:", response.data);
                this.info = response.data || {};
            } catch (error) {
                console.error("Error fetching info:", error);
                this.info = {};
            }
        },
    },
};
</script>
