const isAdminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
        console.log("Blocked: not an admin")
      return res.status(401).json({ message: "Access denied. Admins only.", success: false });
    }
  };
  
  export default isAdminMiddleware;
  