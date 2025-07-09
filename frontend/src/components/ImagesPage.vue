<template>
    <!-- title and search bar, at the same hight level-->
    <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- title of this page -->
        <div>
            <h3>Images List</h3>
        </div>
    </div>
    <!--
    use a table to display all images from api response,
    each row should have the following columns:
    - Image ID
    - Image Tag
    - Image Size
    - Created At
    Let table can sort by each column, and have a action column
    -->
    <table class="table table-striped" style="width: 100%; margin-top: 20px">
        <thead>
            <tr>
                <!-- auto increased number -->
                <th style="width: 5%">#</th>
                <!-- image data from api -->
                <th style="width: 15%">Image ID</th>
                <th style="width: 25%">Image Tag</th>
                <th style="width: 15%">Image Size</th>
                <th style="width: 20%">Created At</th>
                <!-- add a action column, including two button, run and delete image -->
                <th style="width: 20%">Actions</th>
            </tr>
        </thead>
        <tbody>
            <!-- Rows will be populated here -->
            <tr v-for="image in images" :key="image.Id">
                <!-- auto increased number -->
                <td>{{ images.indexOf(image) + 1 }}</td>
                <!-- image id only display first 12 char -->
                <td>{{ image.Id.substring(7, 21) }}</td>
                <!-- image tag, split array to string with multiplt lines, if no tag, display "none" -->
                <td>
                    <span v-if="image.RepoTags && image.RepoTags.length > 0">
                        {{ image.RepoTags.join(", ") }}
                    </span>
                    <span v-else>None</span>
                </td>
                <!-- image size in MB, rounded to 2 decimal places -->
                <td>{{ (image.Size / (1000 * 1000)).toFixed() }} MB</td>
                <!-- created time, convert unix time format to local time -->
                <td>
                    {{ new Date(image.Created * 1000).toLocaleString() }}
                </td>
                <td>
                    <!-- add a detail button, @click: jump to /images/:imageId -->
                    <button class="btn btn-info"
                        @click="$router.push({ name: 'ImageDetail', params: { imageId: image.Id.substring(7, 21) } })">
                        Detail
                    </button>
                    &nbsp;
                    <button class="btn btn-danger" @click="deleteImage(image.Id.substring(7, 21))">
                        Delete
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
// load the images from the API
import axios from "axios";
const API_URL = process.env.VUE_APP_BACKEND_URL;
export default {
    name: "ImagesPage",
    data() {
        return {
            images: [], // Array to hold the images fetched from the API
        };
    },
    mounted() {
        this.fetchImages();
    },
    methods: {
        async fetchImages() {
            try {
                // Fetch images from the API
                // Use the correct URL for your API endpoint
                // Assuming the API is running on localhost:5001
                // and the endpoint is /allImages
                // You can change the URL to match your API endpoint
                console.log("Fetching images from API...");
                const url = `${API_URL}/images`;
                console.log("API URL:", url);
                const response = await axios.get(url);
                console.log("Response from API:", response.data);
                this.images = response.data || [];
            } catch (error) {
                console.error("Error fetching images:", error);
                this.images = [];
            }
        },
        async deleteImage(imageId) {
            try {
                // show confirmation dialog before deleting
                if (!confirm(`Are you sure you want to delete image with ID: ${imageId}?`)) {
                    return; // User cancelled the deletion
                }
                // Call the API to delete the image
                console.log(`Deleting image with ID: ${imageId}`);
                await axios.delete(`${API_URL}/images/${imageId}`);
                // Refresh the images list after deletion
                this.fetchImages();
                // show success message
                alert(`Image with ID: ${imageId} deleted successfully.`);

            } catch (error) {
                console.error(`Error deleting image with ID ${imageId}:`, error);
                // show error message
                alert(`Failed to delete image with ID: ${imageId}. Please try again.`);
            }
        },
    },
};
</script>
