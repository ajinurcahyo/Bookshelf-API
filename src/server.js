const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const startServer = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);

    try {
        await server.start();
        console.log(`Server berjalan pada ${server.info.uri}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();
