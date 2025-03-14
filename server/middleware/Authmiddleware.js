import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    // console.log('Auth Header:', authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

export default authMiddleware