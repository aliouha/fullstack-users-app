import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function UserCard({ user, onEdit, onDelete, canEdit, index }) {
  const [showMenu, setShowMenu] = useState(false)

  // Construire l'URL complète de la photo
  const getPhotoUrl = () => {
    if (!user.photo) {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${user.prenom}&backgroundColor=4A90E2&textColor=FFFFFF`;
    }
    
    if (user.photo.startsWith('http')) {
      return user.photo;
    }
    
    const photoPath = user.photo.startsWith('/') ? user.photo : `/${user.photo}`;
    return `http://192.168.1.14${photoPath}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ 
        y: -8, 
        boxShadow: '0 25px 40px -15px rgba(74, 144, 226, 0.4)',
        rotateX: 0,
      }}
      style={{
        background: 'var(--card-bg)',
        borderRadius: '20px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        position: 'relative',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)',
        transform: 'perspective(1000px) rotateX(2deg)',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
    >
      {/* Menu trois points */}
      {canEdit && (
        <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: 'var(--primary)',
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
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  zIndex: 20,
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
                    color: 'var(--text)',
                    fontSize: '0.9rem',
                    fontFamily: 'DM Sans, sans-serif',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(74, 144, 226, 0.1)'}
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
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  Supprimer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Photo avec bordure 3D animée */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: 2 }}
        style={{
          width: '110px', 
          height: '110px',
          borderRadius: '50%',
          position: 'relative',
          background: 'linear-gradient(135deg, #4A90E2, #67B5FF, #4A90E2, #357ABD)',
          backgroundSize: '300% 300%',
          padding: '4px',
          animation: 'gradientShift 3s ease infinite',
          boxShadow: '0 8px 25px rgba(74, 144, 226, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
      >
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid white',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <img
            src={getPhotoUrl()}
            alt={user.nom}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.prenom}&backgroundColor=4A90E2&textColor=FFFFFF`;
            }}
          />
        </div>
      </motion.div>

      {/* Informations */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.4rem', 
          fontWeight: '500',
          color: 'var(--text)', 
          letterSpacing: '0.03em',
          marginBottom: '4px'
        }}>
          {user.prenom} {user.nom}
        </h2>
        <div style={{
          width: '50px', 
          height: '3px',
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
          margin: '10px auto',
          borderRadius: '2px',
        }} />
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          maxWidth: '220px'
        }}>
          {user.description || 'Aucune description'}
        </p>
      </div>
    </motion.div>
  )
}