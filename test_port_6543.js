import pg from 'pg';
const { Client } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const projectRef = 'xkdwmppsvygzujndpjca';
const password = 'Buraz280325';
const host = 'db.xkdwmppsvygzujndpjca.supabase.co';

const variations = [
    { name: 'Standard Port 6543', user: `postgres.${projectRef}`, port: 6543 },
    { name: 'Simple Port 6543', user: 'postgres', port: 6543 },
];

async function probe() {
    for (const v of variations) {
        console.log(`Probing ${v.name}...`);
        const client = new Client({
            host: host,
            port: v.port,
            user: v.user,
            password: password,
            database: 'postgres',
            ssl: { rejectUnauthorized: false }
        });
        try {
            await client.connect();
            console.log(`SUCCESS! Connected with ${v.name}`);
            await client.end();
            process.exit(0);
        } catch (err) {
            console.log(`FAILED ${v.name}: ${err.message}`);
        }
    }
}

probe();
