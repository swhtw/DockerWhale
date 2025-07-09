<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><router-link to="/">Home</router-link></li>
            <li class="nav-item"><router-link to="/containers">Containers</router-link></li>
            <li class="nav-item"><router-link to="/images">Images</router-link></li>
            <li class="nav-item"><router-link to="/volumes">Volumes</router-link></li>
            <li class="nav-item"><router-link to="/networks">Networks</router-link></li>
        </ul>
    </nav>
    <div id="app">
        <router-view></router-view>
    </div>
    <footer>
        <p>Docker Dashboard</p>
    </footer>
</template>

<script>
// let nav bar current page link hightlighted
export default {
    name: "App",
    // add initial method to set link style, if the current route matches the link, set link font weight to bold and color to gray
    methods: {
        setActiveLink(route) {
            const links = document.querySelectorAll("nav ul li a");
            links.forEach(link => {
                if (link.getAttribute("href") === route) {
                    link.style.fontWeight = "bold";
                } else {
                    link.style.fontWeight = "normal";
                }
            });
        }
    },
    // set active link when the component is mounted
    mounted() {
        this.setActiveLink(this.$route.path);
        this.$router.afterEach((to) => {
            this.setActiveLink(to.path);
        });
    }
};
</script>

<!-- using bootstrap -->
<style>
@import url("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css");

#app {
    padding: 20px;
    /* Ensure the app has padding on horizen sides, 10% of width */

}

/* navbar have same padding as #app */
nav {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-left: 10%;
    padding-right: 10%;
    box-sizing: border-box;
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* Add a subtle shadow for better visibility */
    background-color: #007bff;
    /* Ensure the background is white for better contrast */
}

nav ul {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
}

nav ul li {
    margin: 0 15px;
}

nav ul li a {
    color: white;
    text-decoration: none;
}

nav ul li a:hover {
    text-decoration: underline;
}

/**
    * Footer styles
    only display at the bottom of the page
    * with a fixed position
 */
footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
    padding: 10px 0;
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    color: #6c757d;
    font-size: 14px;
    padding-left: 10%;
    padding-right: 10%;
}

footer p {
    margin: 0;
}
</style>
