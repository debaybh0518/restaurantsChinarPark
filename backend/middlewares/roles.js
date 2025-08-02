// Placeholder for RBAC middleware
module.exports = (roles = []) => (req, res, next) => {
  if (!req.userDetails) return res.status(401).json({ error: 'Unauthorized' });
  if (roles.length && !roles.includes(req.userDetails.Role.name)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};