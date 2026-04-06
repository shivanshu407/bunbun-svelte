const fs = require('fs');

const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, DATABASE_URL } = process.env;

// Only construct it if the user is using the split environment variables (and hasn't provided DATABASE_URL natively)
if (!DATABASE_URL && MYSQL_USER && MYSQL_HOST && MYSQL_DATABASE) {
    console.log("[Deployment Config] Combining isolated MYSQL_ variables into Prisma connection string...");
    
    const encodedPass = encodeURIComponent(MYSQL_PASSWORD || '');
    const port = MYSQL_PORT || '3306';
    const dbUrl = `mysql://${MYSQL_USER}:${encodedPass}@${MYSQL_HOST}:${port}/${MYSQL_DATABASE}?connect_timeout=5&socket_timeout=5`;
    
    // Set as environment variable for current process (Prisma CLI picks this up)
    process.env.DATABASE_URL = dbUrl;
    
    // Also write to .env if it doesn't already contain DATABASE_URL
    try {
        const envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf-8') : '';
        if (!envContent.includes('DATABASE_URL=')) {
            fs.appendFileSync('.env', `\nDATABASE_URL="${dbUrl}"\n`);
        } else {
            // Replace existing DATABASE_URL line
            const updated = envContent.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${dbUrl}"`);
            fs.writeFileSync('.env', updated);
        }
    } catch (e) {
        // If .env doesn't exist or can't be written, that's okay — process.env is set
        console.log("[Deployment Config] Note: Could not write to .env file, using process.env only.");
    }
    
    console.log("[Deployment Config] Successfully built and attached DATABASE_URL for Prisma.");
}
