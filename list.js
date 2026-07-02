const {createClient} = require('redis');
const client = createClient(
    {
        url: "redis://localhost:6380"
    }
);

async function init() {
    try {
        // Connect to Redis
        await client.connect();
        console.log("Connected to Redis");

        const key = "fruits";

        // Clear existing list (optional)
        await client.del(key);

        // ===============================
        // LPUSH - Insert at beginning
        // ===============================
        await client.lPush(key, "Apple");
        await client.lPush(key, "Banana");

        // List: Banana -> Apple

        // ===============================
        // RPUSH - Insert at end
        // ===============================
        await client.rPush(key, "Mango");
        await client.rPush(key, "Orange");

        // List: Banana -> Apple -> Mango -> Orange

        // ===============================
        // LRANGE - Get all elements
        // ===============================
        const fruits = await client.lRange(key, 0, -1);
        console.log("Current List:", fruits);

        // ===============================
        // LPOP - Remove first element
        // ===============================
        const first = await client.lPop(key);
        console.log("Removed from front:", first);

        // ===============================
        // RPOP - Remove last element
        // ===============================
        const last = await client.rPop(key);
        console.log("Removed from end:", last);

        // ===============================
        // LLEN - Get length
        // ===============================
        const length = await client.lLen(key);
        console.log("List Length:", length);

        // ===============================
        // LRANGE again
        // ===============================
        const updatedList = await client.lRange(key, 0, -1);
        console.log("Updated List:", updatedList);

    } catch (err) {
        console.error(err);
    } finally {
        await client.quit();
    }
}

init();