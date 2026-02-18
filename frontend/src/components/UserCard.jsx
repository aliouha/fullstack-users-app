import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function UserCard({ user, onEdit, onDelete, canEdit, index }) {
  const [showMenu, setShowMenu] = useState(false)

  // Construire l'URL complète de la photo
  const getPhotoUrl = () => {
    if (!user.photo) {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${user.prenom}&backgroundColor=1A1A1E&textColor=C9A84C`;
    }
    
    // Si la photo commence par http, c'est déjà une URL complète
    if (user.photo.startsWith('http')) {
      return user.photo;
    }
    
    // Sinon, c'est un chemin relatif type "/uploads/..." ou "uploads/..."
    // On construit l'URL complète
    const photoPath = user.photo.startsWith('/') ? user.photo : `/${user.photo}`;
    return `http://192.168.1.14${photoPath}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(201,168,76,0.12)' }}
      style={{
        background: 'linear-gradient(145deg, #1A1A1E, #111113)',
        border: '1px solid rgba(201,168,76,0.12)',
        borderRadius: '16px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Decorative corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '60px', height: '60px',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.08), transparent)',
        borderBottomLeftRadius: '60px',
      }} />

      {/* Menu trois points */}
      {canEdit && (
        <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 5 }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: 'var(--gold)',
              padding: '0',
            }}
          >
            ⋮
          </motion.button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '30px',
                  right: '0',
                  background: '#1A1A1E',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  overflow: 'hidden',
                  zIndex: 10,
                }}
              >
                <button
                  onClick={() => { onEdit(user); setShowMenu(false); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '10px 20px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--gold)',
                    fontSize: '0.9rem',
                    fontFamily: 'DM Sans, sans-serif',
                    borderBottom: '1px solid rgba(201,168,76,0.1)',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(201,168,76,0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  Modifier
                </button>
                <button
                  onClick={() => { onDelete(user.id); setShowMenu(false); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '10px 20px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#EF4444',
                    fontSize: '0.9rem',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  Supprimer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Photo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          width: '90px', height: '90px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(201,168,76,0.3)',
          boxShadow: '0 0 30px rgba(201,168,76,0.1)',
        }}
      >
        <img
          src={getPhotoUrl()}
          alt={user.nom}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            console.error('Erreur chargement photo:', user.photo);
            e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.prenom}&backgroundColor=1A1A1E&textColor=C9A84C`;
          }}
        />
      </motion.div>

      {/* Info */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.3rem', fontWeight: '500',
          color: '#F0EDE8', letterSpacing: '0.03em',
          marginBottom: '4px'
        }}>
          {user.prenom} {user.nom}
        </h2>
        <div style={{
          width: '30px', height: '1px',
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          margin: '8px auto',
        }} />
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          lineHeight: '1.5',
          maxWidth: '200px'
        }}>
          {user.description || 'Aucune description'}
        </p>
      </div>
    </motion.div>
  )
}