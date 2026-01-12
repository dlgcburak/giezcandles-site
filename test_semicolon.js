import pg from 'pg';
const { Client } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const projectRef = 'xkdwmppsvygzujndpjca';
const password = 'Buraz280325';
const host = 'aws-0-eu-central-1.pooler.supabase.com';

async function probe() {
    // Semicolon format: password;projectRef
    const connectionString = `postgresql://postgres:${password};${projectRef}@${host}:6543/postgres?sslmode=require`;
    console.log(`Probing semicolon format with corrected password...`);
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        console.log(`SUCCESS! Connected with semicolon format.`);
        await client.end();
        process.exit(0);
    } catch (err) {
        console.log(`FAILED: ${err.message}`);
        process.exit(1);
    }
}

probe();
