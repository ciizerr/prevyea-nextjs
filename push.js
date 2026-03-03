const { spawn } = require('child_process');

console.log("Starting script to auto-accept Drizzle drop...");

const child = spawn('node', ['--env-file=.env.local', 'node_modules/drizzle-kit/bin.cjs', 'push']);

child.stdout.on('data', d => {
    const output = d.toString();
    console.log(output);
    
    // Look for the safety prompt
    if(output.includes('Yes, I want to execute all statements')) {
        console.log("Found safety prompt! Sending Down Arrow + Enter...");
        // Send Down Arrow (\u001B[B) then Enter (\r)
        child.stdin.write('\u001B[B\r');
    }
});

child.stderr.on('data', d => {
    console.error(`STDERR: ${d.toString()}`);
});

child.on('close', code => {
    console.log(`Drizzle process exited with code ${code}`);
});
