<template>
    <!-- title and search bar, at the same hight level-->
    <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- title of this page -->
        <div>
            <h3>Networks List</h3>
        </div>
    </div>
    <!--
    use a table to display all networks from api response,
    each row should have the following columns:
    - Network Name
    - Network ID (show first 12 digits)
    - Driver
    - Created At
    - Containers(including all containers connected to this network): conntainer ip
    Let table can sort by each column, and have a action column
    -->
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Network Name</th>
                <th>Network ID</th>
                <th>Driver</th>
                <th>Created At</th>
                <th>Containers</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="network in networks" :key="network.Name">
                <td>{{ network.Name }}</td>
                <td>{{ network.Id.substring(0, 12) }}</td>
                <td>{{ network.Driver }}</td>
                <td>{{ new Date(network.Created).toLocaleString() }}</td>
                <td>
                    <ul class="list-unstyled mb-0">
                        <li v-for="container in network.Containers" :key="container.Id">
                            {{ container.IP }}
                        </li>
                    </ul>
                </td>
                <td>
                    <!-- delete button -->
                    <button class="btn btn-danger btn-sm" @click="deleteNetwork(network.Name)">
                        Delete
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
// load the network from the API
import axios from "axios";
const API_URL = process.env.VUE_APP_BACKEND_URL;
export default {
    name: "NetworksPage",
    data() {
        return {
            networks: [], // Array to hold the networks fetched from the API
        };
    },
    mounted() {
        this.fetchNetworks();
    },
    methods: {
        async fetchNetworks() {
            try {
                const response = await axios.get(`${API_URL}/networks`);
                this.networks = response.data;
            } catch (error) {
                console.error("Error fetching networks:", error);
            }
        },
        async deleteNetwork(networkName) {
            if (confirm(`Are you sure you want to delete the network "${networkName}"?`)) {
                try {
                    await axios.delete(`${API_URL}/networks/${networkName}`);
                    this.fetchNetworks(); // Refresh the list after deletion
                } catch (error) {
                    console.error("Error deleting network:", error);
                }
            }
        },
    },
};
</script>
