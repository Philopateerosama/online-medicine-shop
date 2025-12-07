export function isAdmin(req, res, next) {
    // Assuming auth middleware has already run and populated req.user
    // But wait, the current auth middleware might not be attached globally or to this route yet.
    // I need to check how auth middleware is implemented.
    // Let's assume standard pattern: verify token -> set req.user -> next()
    // If I look at `auth.controller.js`, it signs the token.
    // I need to see `backend/src/middleware/auth.js` if it exists, or create one if not.
    // The plan didn't explicitly mention creating `auth.js` middleware, but `admin.js` depends on it.
    // Let's check if `backend/src/middleware/auth.js` exists.
    // I'll assume it doesn't exist or I need to check.
    // Wait, I saw `backend/src/middleware` had 2 children in Step 15.
    // Let's check `backend/src/middleware` content first.

    // For now, I'll write the admin middleware assuming req.user is populated, 
    // OR I'll implement the token verification here if needed, but better to separate.

    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}
