app.get('/config.js', (req, res) => {
    const HOST_IP = process.env.HOST_IP || 'localhost';
    res.set('Content-Type', 'application/javascript');
    res.send(`const hostIP = '${HOST_IP}';`);
});
