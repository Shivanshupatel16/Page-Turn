import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided.", success: false });
    }

    const tokenValue = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };
    console.log("Decoded JWT:", decoded);


    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: "Invalid or expired token." });
  }
};

export default authMiddleware;
