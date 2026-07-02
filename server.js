const express = require("express");
const axios = require("axios");
const { createClient } = require("redis");

const app = express();
const PORT = 3000;

// Create Redis Client
const client = createClient();

client.on("error", (err) => {
    console.log("Redis Error:", err);
});

// Connect Redis
(async () => {
    await client.connect();
    console.log("Redis Connected");
})();


// Route
app.get("/posts/:id", async (req, res) => {
    const id = req.params.id;
    const cacheKey = `post:${id}`;

    try {
        // Check Redis
        const cachedData = await client.get(cacheKey);

        if (cachedData) {
            console.log("Serving from Redis Cache");
            return res.json({
                source: "Redis Cache",
                data: JSON.parse(cachedData),
            });
        }

        console.log("Fetching from JSONPlaceholder");

        const response = await axios.get(
            `https://jsonplaceholder.typicode.com/posts/${id}`
        );

        // Store in Redis for 60 seconds
        await client.set(cacheKey, JSON.stringify(response.data), {
            EX: 60,
        });

        res.json({
            source: "API",
            data: response.data,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});