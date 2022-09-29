module.exports = {
    apps: [
        {
            name: 'front_next',
            cwd: './',
            script: 'node_modules/next/dist/bin/next',
            args: 'start',
            exec_mode: 'cluster',
            instances: 0,
            autorestart: true,
            listen_timeout: 50000,
            kill_timeout: 5000,
        }
    ],
};