
export const authorize = (roles) => {
    return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role || !roles.includes(user.role)) {
        return res.status(403).json({ status: 'error', message: 'Acceso no autorizado' });
    }
        next();
    };
};
