<template>
    <!-- title and search bar, at the same hight level-->
    <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- title of this page, and back to image button at right side -->
        <div>
            <h3>View details of a specific image</h3>
        </div>
        <div>
            <button class="btn btn-secondary" @click="$router.push({ name: 'Images' })">
                Back to Images
            </button>
        </div>
    </div>
    <!-- these two cards show be displayed at two columns at this page if the width is enougth-->
    <div class="row">
        <div class="col-md-6">
            <h4>Image Details</h4>
            <!-- display image details from api response -->
            <ul class="list-group">
                <li class="list-group-item">
                    <strong>Image ID:</strong> {{ image.Id }}
                </li>
                <li class="list-group-item">
                    <strong>Image Tags:</strong>
                    <span v-if="image.RepoTags && image.RepoTags.length > 0">
                        {{ image.RepoTags.join(", ") }}
                    </span>
                    <span v-else>None</span>
                </li>
                <li class="list-group-item">
                    <strong>Image Size:</strong> {{ (image.Size / (1000 * 1000)).toFixed(2) }} MB
                </li>
                <li class="list-group-item">
                    <strong>Created At:</strong> {{ new Date(image.Created).toLocaleString() }}
                </li>
            </ul>
            <div class="mt-3">
                <h4>Run this Image</h4>
                <!-- display a form for user fill param and submit to run image
                    the form should include:
                    - exposed port (optional)(a number between 1 and 65535)
                    - command to run (optional)(split by space)
                    - environment variables (optional)(can be multiple, use a + button to add more input fields)
                    - volume mounts (optional)(can be multiple, use a + button to add more input fields)-->
                <form @submit.prevent="runImage">
                    <div class="form-group">
                        <!-- image id, cannot edit -->
                        <label for="imageId">Image ID:</label>
                        <input type="text" class="form-control" id="imageId" v-model="image.Id"
                            :placeholder="image.Id"
                            :disabled="true"
                            :readonly="true" />
                        <small class="form-text text-muted">
                            The ID of the image to run. This is automatically filled.
                        </small>
                        <br />
                        <!-- container name and exposed port -->
                        <div class="row">
                            <div class="col-md-6">
                                <!-- container name -->
                                <label for="containerName">Container Name (optional):</label>
                                <input type="text" class="form-control" id="containerName"
                                    v-model="runParams.containerName" />
                                <small class="form-text text-muted">
                                    Enter a name for the container, e.g. my_container
                                </small>
                            </div>
                            <div class="col-md-6">
                                <!-- exposed port -->
                                <label for="port">Exposed Port (optional):</label>
                                <input type="text" class="form-control" id="port" v-model="runParams.ports" />
                                <small class="form-text text-muted">
                                    Enter port to expose, e.g. 8080, 80, 443
                                </small>
                            </div>
                        </div>
                        <br />
                        <!-- command to run -->
                        <label for="command">Command to Run (optional):</label>
                        <input type="text" class="form-control" id="command" v-model="runParams.command" />
                        <small class="form-text text-muted">
                            Enter command to run in the container, e.g. python app.py
                        </small>
                        <br />
                        <!-- environment variables -->
                        <label for="envVars" class="mt-2">Environment Variables (optional):</label>
                        <div v-for="(envVar, index) in runParams.envVars" :key="index" class="input-group mb-2">
                            <input type="text" class="form-control" v-model="runParams.envVars[index]"
                                placeholder="MY_VAR=my_value" />
                            <div class="input-group-append">
                                <button class="btn btn-danger" type="button" @click="removeEnvVar(index)">
                                    &times; Remove
                                </button>
                                <button class="btn btn-success" type="button" @click="addEnvVar">
                                    + Add
                                </button>
                            </div>
                        </div>
                        <small class="form-text text-muted">
                            Enter environment variables in KEY=VALUE format, e.g. MY_VAR=my_value
                        </small>
                        <!-- volume mounts -->
                        <label for="volumeMounts" class="mt-2">Volume Mounts (optional):</label>
                        <div v-for="(volumeMount, index) in runParams.volumeMounts" :key="index"
                            class="input-group mb-2">
                            <input type="text" class="form-control" v-model="runParams.volumeMounts[index]"
                                placeholder="/host/path:/container/path" />
                            <div class="input-group-append">
                                <button class="btn btn-danger" type="button" @click="removeVolumeMount(index)">
                                    &times; Remove
                                </button>
                                <button class="btn btn-success" type="button" @click="addVolumeMount">
                                    + Add
                                </button>
                            </div>
                        </div>
                        <small class="form-text text-muted">
                            Enter volume mounts in /host/path:/container/path format, e.g. /data:/app/data
                        </small>
                        <!-- submit button -->
                        <button type="submit" class="btn btn-primary mt-3">Run Image</button>

                    </div>
                </form>
            </div>
        </div>
        <div class="col-md-6">
            <h4>JSON Data</h4>
            <!-- display image data as formatted JSON -->
            <pre class="bg-light p-3 rounded">{{ formattedJson }}</pre>
        </div>
    </div>
</template>

<script>
// load the images from the API
import axios from "axios";
const API_URL = process.env.VUE_APP_BACKEND_URL;
export default {
    name: "ImageDetail",
    data() {
        return {
            image: {}, // Array to hold the images fetched from the API
            runParams: {
                imageId: "", // ID of the image to run
                containerName: "", // Name of the container to run
                port: "", // Comma-separated string of ports
                command: "", // Command to run in the container
                envVars: [""], // Array of environment variables
                volumeMounts: [""], // Array of volume mounts
            },
        };
    },
    mounted() {
        this.getImage(this.$route.params.imageId); // Fetch image details when component is mounted
    },
    methods: {
        async getImage(imageId) {
            try {
                // get image detail from API
                console.log("Get image detail from API...");
                const url = `${API_URL}/images/${imageId}`;
                console.log("API URL:", url);
                const response = await axios.get(url);
                console.log("Response from API:", response.data);
                this.image = response.data || {};
            } catch (error) {
                console.error("Error fetching images:", error);
                this.image = {};
            }
        },
        runImage() {
            // Prepare the run parameters
            const params = {
                containerName: this.runParams.containerName.trim() || "",
                port: this.runParams.port.trim() || "",
                command: this.runParams.command.trim() || "",
                envVars: this.runParams.envVars.map((v) => v.trim()).filter(Boolean),
                volumeMounts: this.runParams.volumeMounts.map((v) => v.trim()).filter(Boolean),
            };
            // Call the API to run the image with the specified parameters
            axios.post(`${API_URL}/images/${this.image.Id}/run`, params)
                .then((response) => {
                    console.log("Image run successfully:", response.data);
                    alert("Image run successfully!");
                })
                .catch((error) => {
                    console.error("Error running image:", error);
                    alert("Failed to run image. Check console for details.");
                });
        },
        addEnvVar() {
            // Add a new environment variable input field
            this.runParams.envVars.push("");
        },
        removeEnvVar(index) {
            // Remove the specified environment variable input field
            if (this.runParams.envVars.length > 1) {
                this.runParams.envVars.splice(index, 1);
            } else {
                alert("At least one environment variable is required.");
            }
        },
        addVolumeMount() {
            // Add a new volume mount input field
            this.runParams.volumeMounts.push("");
        },
        removeVolumeMount(index) {
            // Remove the specified volume mount input field
            if (this.runParams.volumeMounts.length > 1) {
                this.runParams.volumeMounts.splice(index, 1);
            } else {
                alert("At least one volume mount is required.");
            }
        },
    },
    computed: {
        // You can add computed properties here if needed
        formattedJson() {
            // Format the image data as JSON for display
            return JSON.stringify(this.image, null, 4);
        },
    },
};
</script>
