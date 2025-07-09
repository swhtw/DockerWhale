<template>
    <!-- title and search bar, at the same hight level-->
    <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- title of this page -->
        <div>
            <h3>Volumes List</h3>
        </div>
    </div>
    <!--
    use a table to display all volumes from api response,
    each row should have the following columns:
    - Volume Name
    - Driver
    - Created At
    - Labels
    Let table can sort by each column, and have a action column
    -->
    <table class="table table-striped" style="width: 100%; margin-top: 20px">
        <thead>
            <tr>
                <!-- auto increased number -->
                <th style="width: 5%">#</th>
                <!-- volume data from api -->
                <th style="width: 20%">Volume Name</th>
                <th style="width: 20%">Driver</th>
                <th style="width: 20%">Created At</th>
                <th style="width: 15%">Labels</th>
                <!-- add a action column, including two button, export and delete volume -->
                <th style="width: 20%">Actions</th>
            </tr>
        </thead>
        <tbody>
            <!-- Rows will be populated here -->
            <tr v-for="volume in volumes" :key="volume.Name">
                <!-- auto increased number -->
                <td>{{ volumes.indexOf(volume) + 1 }}</td>
                <!-- volume name, only display first 12 digits -->
                <td>{{ volume.Name.length > 12 ? volume.Name.substring(0, 12) + '...' : volume.Name }}</td>
                <!-- volume driver -->
                <td>{{ volume.Driver }}</td>
                <!-- created time, convert to local time -->
                <td>{{ new Date(volume.CreatedAt).toLocaleString() }}</td>
                <!-- labels, split array to string with multiplt lines, if no label, display "none" -->
                <td>
                    <span v-if="volume.Labels && Object.keys(volume.Labels).length > 0">
                        {{ Object.entries(volume.Labels).map(([key, value]) => `${key}: ${value}`).join(", ") }}
                    </span>
                    <span v-else>None</span>
                </td>
                <!-- action buttons -->
                <td>
                    <!-- <button class="btn btn-primary" @click="exportVolume(volume.Name)">Export</button>
                    &nbsp; -->
                    <button class="btn btn-danger" @click="deleteVolume(volume.Name)">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
// load the volumes from the API
import axios from "axios";
const API_URL = process.env.VUE_APP_BACKEND_URL;
export default {
    name: "VolumesPage",
    data() {
        return {
            volumes: [], // Array to hold the volumes fetched from the API
        };
    },
    mounted() {
        this.fetchVolumes();
    },
    methods: {
        async fetchVolumes() {
            try {
                // Fetch the list of volumes from the API
                const response = await axios.get(`${API_URL}/volumes`);
                // Store the fetched volumes in the component's data
                this.volumes = response.data.Volumes || [];
            } catch (error) {
                console.error("Error fetching volumes:", error);
                // Show an error message to the user
                alert("Failed to fetch volumes. Please try again later.");
            }
        },
        // async exportVolume(volumeName) {
        //     try {
        //         // Call the API to export the volume
        //         const response = await axios.post(`${API_URL}/volumes/${volumeName}/export`);
        //         // Handle the response, e.g., show a success message or download the file
        //         alert(`Volume ${volumeName} exported successfully.`);
        //         // Optionally, you can trigger a file download if the API returns a file
        //         const blob = new Blob([response.data], { type: 'application/octet-stream' });
        //         const url = window.URL.createObjectURL(blob);
        //         const a = document.createElement('a');
        //         a.href = url;
        //         a.download = `${volumeName}.tar`; // Assuming the export is a tar file
        //         document.body.appendChild(a);
        //         a.click();
        //         document.body.removeChild(a);
        //         window.URL.revokeObjectURL(url);
        //     } catch (error) {
        //         console.error("Error exporting volume:", error);
        //         alert(`Failed to export volume ${volumeName}. Please try again later.`);
        //     }
        // },
        async deleteVolume(volumeName) {
            if (confirm(`Are you sure you want to delete the volume "${volumeName}"? This action cannot be undone.`)) {
                try {
                    // Call the API to delete the volume
                    const response = await axios.delete(`${API_URL}/volumes/${volumeName}`);
                    if (response.status !== 204) {
                        throw new Error(`Failed to delete volume: ${response.statusText}`);
                    }
                    // Handle the response, e.g., show a success message
                    alert(`Volume ${volumeName} deleted successfully.`);
                    // Refresh the list of volumes
                    this.fetchVolumes();
                } catch (error) {
                    console.error("Error deleting volume:", error);
                    alert(`Failed to delete volume ${volumeName}. Please try again later.`);
                }
            }
        },
    },
};
</script>
