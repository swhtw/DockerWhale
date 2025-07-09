<template>
    <!-- title and search bar, at the same hight level-->
    <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- title of this page -->
        <div>
            <h3>Containers List</h3>
        </div>
    </div>
    <!--
        use a table to display all containers from api response,
        each row should have the following columns:
        - Container Name
        - Container ID
        - Image Tag
        - Port Bindings
        - Status
        - Created At
        Let table can sort by each column, and have a action column
        -->
    <table class="table table-striped" style="width: 100%; margin-top: 20px">
        <thead>
            <tr>
                <!-- auto increased number -->
                <th style="width: 5%">#</th>
                <!-- container name -->
                <th style="width: 15%">Container Name</th>
                <!-- container id only display first 12 char -->
                <th style="width: 10%">Container ID</th>
                <!-- image tag, split array to string with multiple lines, if no tag, display "none" -->
                <th style="width: 15%">Image Tag</th>
                <!-- port bindings, display as a string -->
                <th style="width: 15%">Port Bindings</th>
                <!-- status of the container -->
                <th style="width: 10%">Status</th>
                <!-- created time, convert unix time format to local time -->
                <th style="width: 10%">Created At</th>
                <!-- action, run stop or delete container -->
                <th style="width: 15%">Action</th>
            </tr>
        </thead>
        <tbody>
            <!-- Rows will be populated here -->
            <tr v-for="container in containers" :key="container.Id">
                <!-- auto increased number -->
                <td>{{ containers.indexOf(container) + 1 }}</td>
                <!-- container name -->
                <td>{{ container.Names[0] }}</td>
                <!-- container id only display first 12 char -->
                <td>{{ container.Id.substring(0, 12) }}</td>
                <!-- image tag, split array to string with multiple lines, if no tag, display "none" -->
                <td>{{ container.Image || "None" }}</td>
                <!-- port bindings, display as a string, format: "publicPort:privatePort" -->
                <td>
                    <span v-if="container.Ports && container.Ports.length > 0">
                        {{container.Ports.map(p => `${p.PublicPort}:${p.PrivatePort}`).join(", ")}}
                    </span>
                    <span v-else>None</span>
                </td>
                <!-- status of the container -->
                <td>{{ container.State }}</td>
                <!-- created time, convert unix time format to local time -->
                <td>{{ new Date(container.Created * 1000).toLocaleString() }}</td>
                <!-- action, detail run stop or delete container 
                    if container is running, show detail and stop button, else show detail, start and delete button
                 -->
                <td>
                    <button class="btn btn-info" @click="$router.push({ name: 'ContainerDetail', params: { containerId: container.Id } })">
                        Detail
                    </button>
                    &nbsp;
                    <button class="btn btn-warning" v-if="container.State === 'running'" @click="stopContainer(container.Id, container.Names[0])">
                        Stop
                    </button>
                    <button class="btn btn-success" v-else @click="startContainer(container.Id, container.Names[0])">
                        Start
                    </button>
                    &nbsp;
                    <button class="btn btn-danger" v-if="container.State !== 'running'" @click="deleteContainer(container.Id, container.Names[0])">
                        Delete
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
// load the containers from the API
import axios from "axios";
const API_URL = process.env.VUE_APP_BACKEND_URL;
export default {
    name: "ContainersPage",
    data() {
        return {
            containers: [], // Array to hold container data
        };
    },
    mounted() {
        // Fetch the list of containers when the component is mounted
        this.fetchContainers();
    },
    methods: {
        async fetchContainers() {
            try {
                // Make an API call to fetch containers
                console.log("Fetching containers from API...");
                const url = `${API_URL}/containers`;
                console.log("API URL:", url);
                const response = await axios.get(`${API_URL}/containers`);
                console.log("Response from API:", response.data);
                console.log("Response status:", response.status);
                // Check if the response is ok (status in the range 200-299)
                // If not, throw an error to be caught in the catch block
                if (response.status < 200 || response.status >= 300) {
                    throw new Error("Failed to fetch containers");
                }
                // Store the fetched containers in the data property
                this.containers = response.data || [];
            } catch (error) {
                console.error("Error fetching containers:", error);
                // Optionally, you can handle the error by showing a notification or alert
            }
        },
        // start a container
        async startContainer(containerId, containerName) {
            try {
                // Call the API to start the container
                console.log(`Starting container ${containerName}`);
                await axios.post(`${API_URL}/containers/${containerId}/start`);
                // Refresh the containers list after starting
                this.fetchContainers();
                // Show success message
                alert(`Container: ${containerName} started successfully.`);
            } catch (error) {
                console.error(`Error starting container ${containerName}:`, error);
                // Show error message
                alert(`Error starting container ${containerName}: ${error.message}`);
            }  
        },
        // stop a container
        async stopContainer(containerId, containerName) {
            try {   
                // Show confirmation dialog before stopping
                if (!confirm(`Are you sure you want to stop container ${containerName}?`)) {
                    return; // User cancelled the stop action
                }
                // Call the API to stop the container
                console.log(`Stopping container ${containerName}`);
                await axios.post(`${API_URL}/containers/${containerId}/stop`);
                // Refresh the containers list after stopping
                this.fetchContainers();
                // Show success message
                alert(`Container: ${containerName} stopped successfully.`);
            } catch (error) {
                console.error(`Error stopping container ${containerName}:`, error);
                // Show error message
                alert(`Failed to stop container ${containerName}. Please try again.`);
            }
        },
        // delete a container
        async deleteContainer(containerId, containerName) {
            try {
                // Show confirmation dialog before deleting
                if (!confirm(`Are you sure you want to delete container ${containerName}?`)) {
                    return; // User cancelled the deletion
                }
                // Call the API to delete the container
                console.log(`Deleting container ${containerName}`);
                await axios.delete(`${API_URL}/containers/${containerId}`);
                // Refresh the containers list after deletion
                this.fetchContainers();
                // Show success message
                alert(`Container ${containerName} deleted successfully.`);
            } catch (error) {  
                console.error(`Error deleting container ${containerName}:`, error);
                // Show error message
                alert(`Failed to delete container ${containerName}. Please try again.`);
            }
        },
    },
};
</script>
