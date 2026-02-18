import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Navbar({ user, onLogout, onLogin, onRegister }) {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 2rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo + message animé */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          whileHover={{ scale: 1.02 }}
        >
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '700', color: '#FFFFFF'
          }}>U</div>
          <span style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.4rem', fontWeight: '500',
            color: '#1E1E1E', letterSpacing: '0.05em'
          }}>UserManager</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            background: 'rgba(201,168,76,0.1)',
            padding: '6px 14px',
            borderRadius: '30px',
            border: '1px solid rgba(201,168,76,0.3)',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: '500' }}
          >
            ✦ Bienvenue sur mon réseau ✦
          </motion.span>
        </motion.div>
      </div>

      {/* Boutons d'authentification */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                border: '1px solid rgba(201,168,76,0.3)',
                color: 'var(--gold)',
                padding: '8px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Déconnexion
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
              }}
            >
              Connexion
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(201,168,76,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onRegister}
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
                border: 'none',
                color: '#FFFFFF',
                padding: '8px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              S'inscrire
            </motion.button>
          </>
        )}
      </div>
    </motion.nav>
  )
}