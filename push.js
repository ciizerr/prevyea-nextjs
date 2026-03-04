/* eslint-disable */
const { spawn } = require('child_process');

console.log("Starting script to auto-accept Drizzle drop...");

const child = spawn('node', ['--env-file=.env.local', 'node_modules/drizzle-kit/bin.cjs', 'push']);

let hasHandledDataLoss = false;

child.stdout.on('data', d => {
    const output = d.toString();
    console.log(output);
    
    // Safety prompt catch (Warning: Found data-loss statements)
    // We want to simulate pushing Down Arrow then Enter
    if(output.includes("Do you still want to push changes?") && !hasHandledDataLoss) {
        hasHandledDataLoss = true;
        console.log("Found data-loss prompt! Sending Down Arrow + Enter...");
        // Delay slightly for render
        setTimeout(() => {
            child.stdin.write('\u001B[B\r');
        }, 500);
    }

    // Safety Prompt catch (No, abort vs Yes...)
    if(output.includes("Yes, I want to execute all statements") && !hasHandledDataLoss) {
        console.log("Found generic safety prompt! Sending Down Arrow + Enter...");
        setTimeout(() => {
            child.stdin.write('\u001B[B\r');
        }, 500);
    }
});

child.stderr.on('data', d => {
    console.error(`STDERR: ${d.toString()}`);
});

child.on('close', code => {
    console.log(`Drizzle process exited with code ${code}`);
    process.exit(code);
});
