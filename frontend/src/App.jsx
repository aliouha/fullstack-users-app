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
        {/* Hero section avec texte animé */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <motion.h1
            initial={{ scale: 0.95 }}
            animate={{ 
              scale: 1,
              color: ['#2C3E50', '#4A90E2', '#2C3E50'],
            }}
            transition={{ 
              scale: { delay: 0.2, type: "spring", stiffness: 100 },
              color: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              fontWeight: "700",
              lineHeight: 1.3,
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {user 
              ? "Bienvenue sur mon réseau d'amitié" 
              : "Rejoignez mon réseau d'amitié"}
          </motion.h1>
          
          {/* Ligne décorative animée */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              height: '3px',
              background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
              margin: '1.5rem auto',
              borderRadius: '2px',
            }}
          />

          {/* Sous-titre avec rôle si connecté */}
          {user && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                color: 'var(--text-muted)',
                fontSize: '1rem',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {userRole === 'admin' ? (
                <>👑 <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Mode Administrateur</span></>
              ) : userCardId ? (
                <>✓ Vous faites partie du réseau</>
              ) : (
                <>💫 Créez votre profil pour rejoindre le réseau</>
              )}
            </motion.p>
          )}
        </motion.section>

        {/* Bouton Ajouter (seulement si autorisé) */}
        {canAddCard && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(74, 144, 226, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditUser(null);
                setShowModal(true);
              }}
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                border: 'none',
                color: '#FFFFFF',
                padding: '12px 28px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
              }}
            >
              + Ajouter un profil
            </motion.button>
          </div>
        )}

        {/* Banner invité */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(74, 144, 226, 0.08)',
              border: '1px solid rgba(74, 144, 226, 0.2)',
              borderRadius: '12px',
              padding: '1rem 1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              👁️ Mode lecture — <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Connectez-vous</span> pour rejoindre le réseau
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setAuthMode('login')}
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                border: 'none',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: '0 2px 10px rgba(74, 144, 226, 0.3)',
              }}
            >
              Se connecter
            </motion.button>
          </motion.div>
        )}

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
            <div style={{ fontSize: "3rem", marginBottom: "1rem", color: 'var(--primary)' }}>✦</div>
            <p
              style={{
                color: "var(--text-muted)",
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.3rem",
              }}
            >
              Le réseau est vide pour l'instant
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