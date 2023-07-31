import Fastify from 'fastify';

const app = Fastify({
    logger: true
});

(async () => {
    try {
        await app.listen({ port: 8888 });
        console.log('Server running port 8888');
    } catch (err) {
        console.log('Error: ', err);
    }
})();