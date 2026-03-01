import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header)
    return res.status(403).json({ message: "Token no proporcionado." });

  const token = header.split(" ")[1];
  if (!token)
    return res.status(403).json({ message: "Formato de token inválido." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Compatibilidad: se conserva req.usuario y se agrega req.user
    req.usuario = decoded;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado." });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.rol !== role) {
      return res.status(403).json({
        message: "No autorizado para esta acción",
      });
    }
    next();
  };
};
