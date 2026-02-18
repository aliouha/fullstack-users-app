import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Navbar({ user, onLogout, onLogin, onRegister }) {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0.8rem 2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      {/* Logo */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        whileHover={{ scale: 1.02 }}
      >
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', fontWeight: '700', color: '#FFFFFF'
        }}>FN</div>
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.4rem', fontWeight: '500',
          color: 'var(--text)', letterSpacing: '0.05em'
        }}>FriendNet</span>
      </motion.div>

      {/* Message de bienvenue animé (centré) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          flex: 1,
          textAlign: 'center',
          minWidth: '200px',
        }}
      >
        <motion.span
          animate={{
            color: ['#4A90E2', '#7BB0F0', '#4A90E2'],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{
            background: 'rgba(74,144,226,0.08)',
            padding: '6px 18px',
            borderRadius: '30px',
            border: '1px solid var(--border)',
            fontSize: '0.9rem',
            fontWeight: '500',
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
        >
          ✦ Bienvenue sur mon réseau ✦
        </motion.span>
      </motion.div>

      {/* Boutons d'authentification avec icônes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {user ? (
          <>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {user.email}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--primary)',
                padding: '8px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              🚪 Déconnexion
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'DM Sans, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🔑 Connexion
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(74,144,226,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onRegister}
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                border: 'none',
                color: '#FFFFFF',
                padding: '8px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                fontFamily: 'DM Sans, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ✍️ S'inscrire
            </motion.button>
          </>
        )}
      </div>
    </motion.nav>
  )
}