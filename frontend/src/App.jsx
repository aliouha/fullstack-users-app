import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import UserCard from "./components/UserCard";
import UserModal from "./components/UserModal";
import AuthModal from "./components/AuthModal";

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

  // Fonction utilitaire pour récupérer les headers avec le token (pour les requêtes JSON)
  const getHeaders = () => ({
    "Content-Type": "application/json",
    ...(user ? { Authorization: `Bearer ${user.token}` } : {}),
  });

  // Version de fetchUsers qui accepte un token en paramètre (pour l'appel après connexion)
  const fetchUsersWithToken = async (token) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(API, { headers });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur fetchUsers:", err);
      setUsers([]);
    }
  };

  // Fetch classique (utilise l'état user actuel)
  const fetchUsers = async () => {
    await fetchUsersWithToken(user?.token);
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Seulement au montage

  const handleSave = async (form) => {
    // form contient { nom, prenom, description, photo (File) }
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
        headers: user ? { Authorization: `Bearer ${user.token}` } : {}, // Pas de Content-Type !
        body: data,
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      // Si besoin de récupérer l'utilisateur créé/modifié : await res.json()
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de l'enregistrement");
      return;
    }

    setShowModal(false);
    setEditUser(null);
    fetchUsers(); // Rafraîchir la liste
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      fetchUsers();
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Impossible de supprimer l'utilisateur");
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
    fetchUsers(); // Pour recharger la liste en mode lecture (si autorisé)
  };

  const handleAuthSuccess = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    setUser({ token: data.token, email: data.email });
    // Utiliser le token fraîchement reçu pour recharger les utilisateurs
    fetchUsersWithToken(data.token);
    setAuthMode(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)" }}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onLogin={() => setAuthMode("login")}
        onRegister={() => setAuthMode("register")}
      />

      <main
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem" }}
      >
        {/* Header */}
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
                  color: "#F0EDE8",
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
            </div>

            {user && (
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
                  color: "#0A0A0B",
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

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(201,168,76,0.3), transparent)",
              marginTop: "1.5rem",
            }}
          />
        </motion.div>

        {/* Guest banner */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.15)",
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              👁️ Mode lecture —{" "}
              <span style={{ color: "var(--gold)" }}>Connectez-vous</span> pour
              gérer les utilisateurs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setAuthMode("login")}
              style={{
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)",
                color: "var(--gold)",
                padding: "7px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Se connecter
            </motion.button>
          </motion.div>
        )}

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <AnimatePresence>
            {users.map((u, i) => (
              <UserCard
                key={u.id}
                user={u}
                index={i}
                isAuthenticated={!!user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
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

      {/* Modals */}
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