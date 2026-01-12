import pg from 'pg';
const { Client } = pg;

async function check() {
    console.log("Connecting to user provided URI...");
    const client = new Client({
        connectionString: "postgresql://postgres:Buraz280325@db.xkdwmppsvygzujndpjca.supabase.co:5432/postgres"
    });
    try {
        await client.connect();
        console.log("SUCCESS");
        await client.end();
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

check();
