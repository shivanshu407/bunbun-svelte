const fs = require('fs');

const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, DATABASE_URL } = process.env;

// Only construct it if the user is using the split environment variables (and hasn't provided DATABASE_URL natively)
if (!DATABASE_URL && MYSQL_USER && MYSQL_HOST && MYSQL_DATABASE) {
    console.log("[Deployment Config] Combining isolated MYSQL_ variables into Prisma connection string...");
    
    const encodedPass = encodeURIComponent(MYSQL_PASSWORD || '');
    const port = MYSQL_PORT || '3306';
    const dbUrl = `mysql://${MYSQL_USER}:${encodedPass}@${MYSQL_HOST}:${port}/${MYSQL_DATABASE}`;
    
    // Export dynamically to .env so the Prisma CLI engines can find it during build loops
    fs.appendFileSync('.env', `\nDATABASE_URL="${dbUrl}"\n`);
    
    console.log("[Deployment Config] Successfully built and attached DATABASE_URL for Prisma.");
}
