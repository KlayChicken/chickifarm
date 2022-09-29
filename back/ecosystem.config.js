module.exports = {
    apps: [
        {
            name: 'app',
            script: './server.js',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            instance_var: 'CHICKIFARM_ID',
            instances: 0,
            exec_mode: 'cluster',
            wait_ready: true,
            listen_timeout: 50000,
            kill_timeout: 5000,
        }
    ],
}