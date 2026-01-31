
module.exports = {
    apps: [
      {
        name: 'sacred_backend',          
        script: './app.js',                   
        instances: 1,                         
        exec_mode: 'cluster',               
        watch: true,                   
        env: {
          NODE_ENV: 'dev',
          PORT: 3000,
        },
        env_production: {
          NODE_ENV: 'prod',
          PORT: 8080,
        }
      }
    ]
  };