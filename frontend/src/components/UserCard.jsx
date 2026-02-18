import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function UserCard({ user, onEdit, onDelete, canEdit, index }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -8, boxShadow: '0 25px 40px -15px rgba(201,168,76,0.3)' }}
      style={{
        background: 'var(--card-bg)',
        borderRadius: '20px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        position: 'relative',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
        border: '1px solid rgba(201,168,76,0.2)',
        transform: 'perspective(1000px) rotateX(2deg)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Menu trois points (si autorisé) */}
      {canEdit && (
        <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
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
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
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
                    color: 'var(--text)',
                    fontSize: '0.9rem',
                    fontFamily: 'DM Sans, sans-serif',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                  }}
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
                >
                  Supprimer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Photo avec bordure dorée animée */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          width: '100px', height: '100px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid transparent',
          background: 'linear-gradient(45deg, #C9A84C, #E8C97A, #C9A84C) border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '3px',
        }}
      >
        <img
          src={user.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${user.prenom}&backgroundColor=C9A84C&textColor=FFFFFF`}
          alt={user.nom}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      </motion.div>

      {/* Informations */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.4rem', fontWeight: '500',
          color: 'var(--text)', letterSpacing: '0.03em',
          marginBottom: '4px'
        }}>
          {user.prenom} {user.nom}
        </h2>
        <div style={{
          width: '40px', height: '2px',
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          margin: '8px auto',
        }} />
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          maxWidth: '200px'
        }}>
          {user.description || 'Aucune description'}
        </p>
      </div>
    </motion.div>
  )
}