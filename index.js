const {createClient} = require('redis');
const client = createClient(
    {
        url: "redis://localhost:6380"
    }
);

client.on('error', (err) => console.log('Redis Client Error', err));

async function main(){
    await client.connect();
    console.log("Redis client connected successfully");
    await client.set("name", "laraib");
    const value = await client.get("name");
    console.log(value);
    await client.quit();
}
main();