<template>
    <!-- title and search bar, at the same hight level-->
    <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- title of this page, and back to image button at right side -->
        <div>
            <h3>View details of a specific container</h3>
        </div>
        <div>
            <button class="btn btn-secondary" @click="$router.push({ name: 'Containers' })">
                Back to Containers
            </button>
        </div>
    </div>
    <!-- these two cards show be displayed at two columns at this page if the width is enougth-->
    <div class="row">
        <div class="col-md-6">
            <h4>Container Details</h4>
            <!-- display image details from api response -->
            <ul class="list-group">
                <li class="list-group-item">
                    <strong>Container Name:</strong> {{ container.Name }}
                </li>
                <li class="list-group-item">
                    <strong>Container ID:</strong> {{ container.Id ? container.Id.substring(0, 12) : "N/A" }}
                </li>
                <li class="list-group-item">
                    <strong>Image:</strong> {{ container.Image || "N/A" }}
                </li>
                <li class="list-group-item">
                    <strong>Status:</strong> {{ container.State || "N/A" }}
                </li>
                <li class="list-group-item">
                    <strong>Port Bindings:</strong>
                    <span v-if="container.Ports && container.Ports.length > 0">
                        {{ container.Ports.map(p => `${p.PrivatePort} -> ${p.PublicPort}`).join(", ") }}
                    </span>
                    <span v-else>None</span>
                </li>
                <li class="list-group-item">
                    <strong>Created At:</strong>
                    {{ container.Created ? new Date(container.Created).toLocaleString() : "N/A" }}
                </li>
                <li class="list-group-item">
                    <strong>Command:</strong> {{ container.Command || "N/A" }}
                </li>
                <li class="list-group-item">
                    <strong>Environment Variables:</strong>
                    <span v-if="container.Env && container.Env.length > 0">
                        {{ container.Env.join(", ") }}
                    </span>
                    <span v-else>None</span>
                </li>
                <li class="list-group-item">
                    <strong>Mounts:</strong>
                    <span v-if="container.Mounts && container.Mounts.length > 0">
                        {{ container.Mounts.map(m => `${m.Source} -> ${m.Destination}`).join(", ") }}
                    </span>
                    <span v-else>None</span>
                </li>
            </ul>
        </div>
        <div class="col-md-6">
            <h4>JSON Data</h4>
            <!-- display image data as formatted JSON -->
            <pre class="bg-light p-3 rounded">{{ formattedJson }}</pre>
        </div>
    </div>
</template>

<script>
// load the container from the API
import axios from "axios";
const API_URL = process.env.VUE_APP_BACKEND_URL;
export default {
    name: "ContainerDetail",
    data() {
        return {
            container: {}, // Array to hold the images fetched from the API
        };
    },
    mounted() {
        this.getContainer(this.$route.params.containerId); // Fetch image details when component is mounted
    },
    methods: {
        async getContainer(containerId) {
            try {
                // get container detail from API
                console.log("Get container detail from API...");
                const url = `${API_URL}/containers/${containerId}`;
                console.log("API URL:", url);
                const response = await axios.get(url);
                console.log("Response from API:", response.data);
                this.container = response.data || {};
            } catch (error) {
                console.error("Error fetching container:", error);
                this.container = {};
            }
        },
    },
    computed: {
        // You can add computed properties here if needed
        formattedJson() {
            // Format the image data as JSON for display
            return JSON.stringify(this.container, null, 4);
        },
    },
};
</script>
