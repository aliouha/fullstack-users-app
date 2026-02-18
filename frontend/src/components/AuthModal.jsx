import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = 'http://192.168.1.14'

export default function AuthModal({ mode, onClose, onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('email', data.email)
      onSuccess(data)
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally { setLoading(false) }
  }

  const inputStyle = {
    background: 'rgba(74, 144, 226, 0.05)',
    border: '1px solid rgba(74, 144, 226, 0.2)',
    borderRadius: '10px',
    padding: '14px 16px',
    color: 'var(--text)',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    width: '100%',
    transition: 'all 0.2s',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '1rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'white',
            border: '1px solid rgba(74, 144, 226, 0.2)',
            borderRadius: '24px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 50px 100px rgba(74, 144, 226, 0.15)',
          }}
        >
          {/* Header avec icône */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                margin: '0 auto 1.2rem',
                boxShadow: '0 8px 25px rgba(74, 144, 226, 0.3)',
              }}
            >
              U
            </motion.div>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '2.2rem',
                fontWeight: '500',
                color: 'var(--text)',
                marginBottom: '0.5rem'
              }}
            >
              {mode === 'login' ? 'Bon retour' : 'Bienvenue'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {mode === 'login'
                ? 'Connectez-vous pour gérer les utilisateurs'
                : 'Créez votre compte UserManager'}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
          >
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={e => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.background = 'rgba(74, 144, 226, 0.08)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(74, 144, 226, 0.2)';
                e.target.style.background = 'rgba(74, 144, 226, 0.05)';
              }}
            />
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={e => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.background = 'rgba(74, 144, 226, 0.08)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(74, 144, 226, 0.2)';
                e.target.style.background = 'rgba(74, 144, 226, 0.05)';
              }}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  color: '#EF4444',
                  fontSize: '0.85rem',
                  background: 'rgba(239,68,68,0.08)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                border: 'none',
                color: 'white',
                padding: '15px',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                opacity: loading ? 0.7 : 1,
                marginTop: '0.5rem',
                boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
              }}
            >
              {loading ? '⏳ Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}