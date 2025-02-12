/**@type {import("drizzle-kit").Config} */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_xDtrP3IG7ZsS@ep-wispy-block-a83w5osw-pooler.eastus2.azure.neon.tech/Ai-interview-mocker?sslmode=require'
    }
}