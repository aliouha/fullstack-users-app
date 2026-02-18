import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import UserCard from "./components/UserCard";
import UserModal from "./components/UserModal";
import AuthModal from "./components/AuthModal";
import "./index.css";

const API = "http://192.168.1.14/api/users";

export default function App() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    return token ? { token, email } : null;
  });
  const [userRole, setUserRole] = useState(null);
  const [userCardId, setUserCardId] = useState(null);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    ...(user ? { Authorization: `Bearer ${user.token}` } : {}),
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur fetchUsers:", err);
      setUsers([]);
    }
  };

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch("http://192.168.1.14/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await res.json();
      setUserRole(userData.role);
      setUserCardId(userData.user_card_id);
    } catch (err) {
      console.error("Erreur récupération infos user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    if (user?.token) {
      fetchUserInfo(user.token);
    }
  }, []);

  const handleSave = async (form) => {
    const data = new FormData();
    data.append("nom", form.nom);
    data.append("prenom", form.prenom);
    data.append("description", form.description);
    if (form.photo) data.append("photo", form.photo);

    const url = editUser ? `${API}/${editUser.id}` : API;
    const method = editUser ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: user ? { Authorization: `Bearer ${user.token}` } : {},
        body: data,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Erreur ${res.status}`);
      }

      if (!editUser && userRole === "user") {
        const newUser = await res.json();
        setUserCardId(newUser.id);
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert(err.message);
      return;
    }

    setShowModal(false);
    setEditUser(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Erreur ${res.status}`);
      }

      if (id === userCardId) {
        setUserCardId(null);
      }

      fetchUsers();
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
    setUserRole(null);
    setUserCardId(null);
    fetchUsers();
  };

  const handleAuthSuccess = async (data) => {
    setUser({ token: data.token, email: data.email });
    setAuthMode(null);
    await fetchUserInfo(data.token);
    fetchUsers();
  };

  const canAddCard = user && (userRole === "admin" || !userCardId);
  const canEditCard = (cardId) => {
    if (!user) return false;
    if (userRole === "admin") return true;
    return cardId === userCardId;
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onLogin={() => setAuthMode("login")}
        onRegister={() => setAuthMode("register")}
      />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Hero section inspirée de l'image 1 */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: "center",
            marginBottom: "4rem",
            padding: "2rem",
            background: "linear-gradient(135deg, rgba(201,168,76,0.05), rgba(255,255,255,0.5))",
            borderRadius: "40px",
          }}
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(2.5rem, 8vw, 4rem)",
              fontWeight: "400",
              color: "var(--text)",
              lineHeight: 1.1,
              marginBottom: "0.5rem",
            }}
          >
            Découvrez notre réseau
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Explorez les profils, connectez-vous et partagez votre univers.
          </motion.p>
        </motion.section>

        {/* Header avec compteur et bouton ajouter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "3rem" }}
        >
          <p
            style={{
              color: "var(--gold)",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Répertoire
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: "400",
                  color: "var(--text)",
                  lineHeight: 1.1,
                }}
              >
                Utilisateurs
                <span
                  style={{
                    color: "var(--gold)",
                    marginLeft: "12px",
                    fontSize: "0.6em",
                  }}
                >
                  ({users.length})
                </span>
              </h1>
              {user && (
                <p style={{ 
                  color: "var(--text-muted)", 
                  fontSize: "0.8rem", 
                  marginTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  {userRole === "admin" ? (
                    <>👑 <span style={{ color: "var(--gold)" }}>Admin</span> - Tous pouvoirs</>
                  ) : userCardId ? (
                    <>👤 Vous avez déjà créé votre card</>
                  ) : (
                    <>👤 Créez votre card personnelle</>
                  )}
                </p>
              )}
            </div>

            {canAddCard && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(201,168,76,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditUser(null);
                  setShowModal(true);
                }}
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
                  border: "none",
                  color: "#FFFFFF",
                  padding: "12px 28px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  fontFamily: "DM Sans, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                + Ajouter
              </motion.button>
            )}
          </div>

          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, rgba(201,168,76,0.3), transparent)",
              marginTop: "1.5rem",
            }}
          />
        </motion.div>

        {/* Grille responsive */}
        <div className="user-grid">
          <AnimatePresence>
            {users.map((u, i) => (
              <UserCard
                key={u.id}
                user={u}
                index={i}
                canEdit={canEditCard(u.id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* État vide */}
        {users.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "5rem 0" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✦</div>
            <p
              style={{
                color: "var(--text-muted)",
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.3rem",
              }}
            >
              Aucun utilisateur pour l'instant
            </p>
          </motion.div>
        )}
      </main>

      {/* Modales */}
      <AnimatePresence>
        {showModal && (
          <UserModal
            onClose={() => {
              setShowModal(false);
              setEditUser(null);
            }}
            onSave={handleSave}
            editUser={editUser}
          />
        )}
        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}