import User from '../models/User.js';

export async function authenticate(request, reply) {
    try {
        await request.jwtVerify();
        const user = await User.findById(request.user.id).select('-password');
        if (!user) return reply.code(401).send({ error: 'User not found' });
        request.user = user;
    } catch {
        reply.code(401).send({ error: 'Unauthorized' });
    }
}