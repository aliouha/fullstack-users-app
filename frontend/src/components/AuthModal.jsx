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
    background: 'rgba(0,0,0,0.02)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '8px', padding: '12px 16px',
    color: 'var(--text)', fontSize: '0.9rem',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none', width: '100%',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '1rem',
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
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '20px', padding: '2.5rem',
            width: '100%', maxWidth: '400px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '44px', height: '44px',
              background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
              borderRadius: '10px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: '700',
              color: '#FFFFFF', marginBottom: '1.2rem'
            }}>U</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem', fontWeight: '500', color: 'var(--text)',
            }}>
              {mode === 'login' ? 'Bon retour' : 'Créer un compte'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              {mode === 'login' ? 'Connectez-vous pour gérer les utilisateurs' : 'Rejoignez UserManager'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              name="email" type="email" placeholder="Email"
              value={form.email} onChange={handleChange} required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.8)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
            />
            <input
              name="password" type="password" placeholder="Mot de passe"
              value={form.password} onChange={handleChange} required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.8)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  color: '#EF4444', fontSize: '0.85rem',
                  background: 'rgba(239,68,68,0.08)',
                  padding: '10px 14px', borderRadius: '8px',
                  border: '1px solid rgba(239,68,68,0.2)'
                }}
              >{error}</motion.p>
            )}

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(201,168,76,0.3)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
                border: 'none', color: '#FFFFFF',
                padding: '13px', borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem', fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                opacity: loading ? 0.7 : 1,
                marginTop: '0.5rem'
              }}
            >
              {loading ? '⏳ ...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}