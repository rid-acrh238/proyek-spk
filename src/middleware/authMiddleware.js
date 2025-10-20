import jwt from "jsonwebtoken"

const SECRET_KEY = "INI_RAHASIA";

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan!" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token tidak valid!" });
    req.user = user; // token valid → simpan data user di request
    next();
  });
}

export function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    // Kalau session ada → lanjut ke route berikutnya
    next();
  } else {
    // Kalau belum login → tolak akses
    res.status(401).json({ message: "Akses ditolak! Silakan login dulu." });
  }
}

//router.use(isAuthenticated, isAdmin);
router.use(isAuthenticated);

//middleware khusus admin Role
// export function isAdmin(req, res, next) {
//   if (req.session?.user?.role === "admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Hanya admin yang bisa mengakses!" });
//   }
// }

