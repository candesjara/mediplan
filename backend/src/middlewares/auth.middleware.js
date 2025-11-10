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
    req.usuario = decoded; // guarda info del usuario en la request
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado." });
  }
};
