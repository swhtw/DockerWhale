/**
 * This is the main entry point for the Node.js backend of the application.
 * It sets up the Express server, connects to docker deamon, and defines API routes.
 * The server listens on port 3000 by default, or the port specified in the environment
 * variable PORT.
 */

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createRequire } from "module";
import Docker from "dockerode";

const require = createRequire(import.meta.url);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Docker client setup
const docker = new Docker({
    socketPath: "/var/run/docker.sock", // Default Docker socket path
});

// API routes
// get all images
app.get("/images", async (req, res) => {
    try {
        const images = await docker.listImages();
        res.json(images);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

// get specific image by ID
app.get("/images/:imageId", async (req, res) => {
    const { imageId } = req.params;
    try {
        const image = await docker.getImage(imageId).inspect();
        res.json(image);
    } catch (error) {
        console.error("Error fetching image:", error);
        if (error.statusCode === 404) {
            res.status(404).json({ error: "Image not found" });
        } else {
            res.status(500).json({ error: "Failed to fetch image" });
        }
    }
});

// run a docker image
app.post("/images/:imageId/run", async (req, res) => {
    const { imageId } = req.params; // Get imageId from request parameters
    const { containerName, port, command, envVars, volumeMounts } = req.body;
    try {
        console.log("Running image with parameters:", {
            imageId,
            containerName,
            port,
            command,
            envVars,
            volumeMounts,
        });
        // Validate required fields
        if (!imageId || typeof imageId !== "string") {
            return res.status(400).json({ error: "Image name is required" });
        }
        // Prepare container options, including image ID, container name, command, ports, environment variables, and volume mounts
        const containerOptions = {
            Image: imageId,
            name: containerName || undefined, // Use undefined if no name is provided
            Tty: true, // Allocate a pseudo-TTY
            Cmd: command ? command.split(" ") : [], // Split command into an array
            ExposedPorts: {}, // Initialize ExposedPorts
            Env: [], // Initialize environment variables
            // Initialize mount volumes
            Volumes: {},
            // Initialize HostConfig with empty PortBindings and Binds
            HostConfig: {
                PortBindings: {},
                Binds: [],
            },
        };
        // Handle port mapping
        // if port is not empty, add it to ExposedPorts and HostConfig
        if (port && typeof port === "string" && port.trim() !== "") {
            containerOptions.ExposedPorts[`"${port}/tcp"`] = {};
            containerOptions.HostConfig.PortBindings[`${port}/tcp`] = [
                { HostPort: port },
            ];
        }
        // Handle environment variables
        if (envVars && Array.isArray(envVars)) {
            containerOptions.Env = envVars.map((e) => {
                if (typeof e !== "string" || !e.includes("=")) {
                    throw new Error(
                        `Invalid environment variable format: ${e}. Expected format is 'key=value'.`
                    );
                }
                return e.trim(); // Ensure no leading/trailing spaces
            });
        }
        // Handle volume mapping
        if (volumeMounts && Array.isArray(volumeMounts)) {
            // Convert volumeMounts to the format required by Docker
            containerOptions.Volumes = {};
            volumeMounts.forEach((v) => {
                const [host, container] = v.split(":");
                if (!host || !container) {
                    throw new Error(
                        `Invalid volume mount format: ${v}. Expected format is 'host:container'.`
                    );
                }
                containerOptions.Volumes[container] = {};
                if (!containerOptions.HostConfig.Binds) {
                    containerOptions.HostConfig.Binds = [];
                }
                containerOptions.HostConfig.Binds.push(`${host}:${container}`);
            });
        }
        // Create and start the container
        console.log("Container options:", containerOptions);
        // Create the container with the specified options
        const container = await docker.createContainer(containerOptions);
        await container.wait(); // Wait for the container to be ready
        await container.attach({ stream: true, stdout: true, stderr: true });
        // Start the container
        await container.start();
        res.status(201).json({
            message: "Container started",
            containerId: container.id,
        });
    } catch (error) {
        console.error("Error running image:", error);
        res.status(500).json({ error: "Failed to run image" });
    }
});

// Delete a docker image
app.delete("/images/:imageId", async (req, res) => {
    const { imageId } = req.params;
    try {
        await docker.getImage(imageId).remove();
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: "Failed to delete image" });
    }
});

// get all containers
app.get("/containers", async (req, res) => {
    try {
        const containers = await docker.listContainers({ all: true });
        console.log("Fetched containers:", containers);
        res.json(containers);
    } catch (error) {
        console.error("Error fetching containers:", error);
        res.status(500).json({ error: "Failed to fetch containers" });
    }
});

// get specific container by ID
app.get("/containers/:containerId", async (req, res) => {
    const { containerId } = req.params;
    try {
        const container = await docker.getContainer(containerId).inspect();
        res.json(container);
    } catch (error) {
        console.error("Error fetching container:", error);
        if (error.statusCode === 404) {
            res.status(404).json({ error: "Container not found" });
        } else {
            res.status(500).json({ error: "Failed to fetch container" });
        }
    }
});

// Start a container
app.post("/containers/:containerId/start", async (req, res) => {
    const { containerId } = req.params;
    try {
        const container = docker.getContainer(containerId);
        await container.start();
        res.status(200).json({ message: "Container started successfully" });
    } catch (error) {
        console.error("Error starting container:", error);
        res.status(500).json({ error: "Failed to start container" });
    }
});

// Stop a container
app.post("/containers/:containerId/stop", async (req, res) => {
    const { containerId } = req.params;
    try {
        const container = docker.getContainer(containerId);
        await container.stop();
        res.status(200).json({ message: "Container stopped successfully" });
    } catch (error) {
        console.error("Error stopping container:", error);
        res.status(500).json({ error: "Failed to stop container" });
    }
});

// Delete a container
app.delete("/containers/:containerId", async (req, res) => {
    const { containerId } = req.params;
    try {
        const container = docker.getContainer(containerId);
        await container.remove();
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting container:", error);
        res.status(500).json({ error: "Failed to delete container" });
    }
});

// get all volumess
app.get("/volumes", async (req, res) => {
    try {
        const volumes = await docker.listVolumes();
        res.json(volumes);
    } catch (error) {
        console.error("Error fetching volumes:", error);
        res.status(500).json({ error: "Failed to fetch volumes" });
    }
});

// get specific volume by name
app.get("/volumes/:volumeName", async (req, res) => {
    const { volumeName } = req.params;
    try {
        const volume = await docker.getVolume(volumeName).inspect();
        res.json(volume);
    } catch (error) {
        console.error("Error fetching volume:", error);
        if (error.statusCode === 404) {
            res.status(404).json({ error: "Volume not found" });
        } else {
            res.status(500).json({ error: "Failed to fetch volume" });
        }
    }
});

// Create a new volume
app.post("/volumes", async (req, res) => {
    const { name, driver, labels } = req.body;
    try {
        const volumeOptions = {
            Name: name,
            Driver: driver || "local", // Default to 'local' driver if not specified
            Labels: labels || {}, // Use empty object if no labels are provided
        };
        const volume = await docker.createVolume(volumeOptions);
        res.status(201).json(volume);
    } catch (error) {
        console.error("Error creating volume:", error);
        res.status(500).json({ error: "Failed to create volume" });
    }
});

// Delete a volume
app.delete("/volumes/:volumeName", async (req, res) => {
    const { volumeName } = req.params;
    try {
        // if volume is in use, it will throw an error
        const volume = docker.getVolume(volumeName);
        const inspect = await volume.inspect();
        if (inspect.UsageData && inspect.UsageData.RefCount > 0) {
            return res.status(400).json({
                error: "Volume is in use and cannot be deleted",
            });
        }
        await docker.getVolume(volumeName).remove();
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting volume:", error);
        res.status(500).json({ error: "Failed to delete volume" });
    }
});

// Get all networks
app.get("/networks", async (req, res) => {
    try {
        const networks = await docker.listNetworks();
        res.json(networks);
    } catch (error) {
        console.error("Error fetching networks:", error);
        res.status(500).json({ error: "Failed to fetch networks" });
    }
});

// get system info
app.get("/info", async (req, res) => {
    try {
        const info = await docker.info();
        res.json(info);
    } catch (error) {
        console.error("Error fetch info:", error);
        res.status(500).json({ error: "Failed to fetch info" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// Export the app for testing purposes
export default app;

// execute command to start the server
// node backend/index.js
