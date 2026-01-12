import pg from 'pg';
const { Client } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const projectRef = 'xkdwmppsvygzujndpjca';
const password = 'Buraz280325';
const host = 'aws-0-eu-central-1.pooler.supabase.com';

async function probe() {
    const connectionString = `postgresql://postgres:Buraz280325@db.xkdwmppsvygzujndpjca.supabase.co:5432/postgres`;
    console.log(`Probing user provided URI...`);
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        console.log(`SUCCESS! Connected with corrected password.`);
        await client.end();
        process.exit(0);
    } catch (err) {
        console.log(`FAILED: ${err.message}`);
        process.exit(1);
    }
}

probe();
