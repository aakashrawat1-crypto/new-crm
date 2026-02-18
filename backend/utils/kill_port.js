const { execSync } = require('child_process');

const PORT = 5001;

function killPort() {
    try {
        console.log(`Checking port ${PORT}...`);
        const output = execSync(`netstat -ano | findstr :${PORT}`).toString();
        const lines = output.split('\n');

        const pids = new Set();
        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(pid) && pid !== '0') {
                pids.add(pid);
            }
        });

        if (pids.size > 0) {
            console.log(`Found processes on port ${PORT}: ${Array.from(pids).join(', ')}`);
            pids.forEach(pid => {
                try {
                    console.log(`Killing process ${pid}...`);
                    execSync(`taskkill /F /T /PID ${pid}`);
                } catch (e) {
                    console.error(`Failed to kill process ${pid}: ${e.message}`);
                }
            });
            console.log(`Port ${PORT} cleared.`);
        } else {
            console.log(`Port ${PORT} is already clear.`);
        }
    } catch (error) {
        // netstat returns exit code 1 if no matches found
        console.log(`Port ${PORT} is clear.`);
    }
}

if (require.main === module) {
    killPort();
}

module.exports = killPort;
