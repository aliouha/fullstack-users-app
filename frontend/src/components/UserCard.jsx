import { motion } from 'framer-motion'

export default function UserCard({ user, onEdit, onDelete, isAuthenticated, index }) {
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
          src={user.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${user.prenom}&backgroundColor=1A1A1E&textColor=C9A84C`}
          alt={user.nom}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

      {/* Buttons (only if authenticated) */}
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', gap: '8px', marginTop: '4px' }}
        >
          <motion.button
            whileHover={{ scale: 1.05, background: 'rgba(201,168,76,0.15)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(user)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(201,168,76,0.3)',
              color: 'var(--gold)',
              padding: '6px 18px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'background 0.2s',
            }}
          >
            Modifier
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(user.id)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#EF4444',
              padding: '6px 18px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            Supprimer
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}