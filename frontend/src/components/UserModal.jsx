import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = 'http://192.168.1.14'

export default function UserModal({ onClose, onSave, editUser }) {
  const [form, setForm] = useState({ photo: '', nom: '', prenom: '', description: '' })
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (editUser) { setForm(editUser); setPreview(editUser.photo || null) }
  }, [editUser])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    const formData = new FormData()
    formData.append('photo', file)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST', body: formData,
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setForm(prev => ({ ...prev, photo: data.url }))
    } catch (err) {
      console.error('Erreur upload:', err)
    } finally { setUploading(false) }
  }

  const handleSubmit = (e) => { e.preventDefault(); onSave(form) }

  const inputStyle = {
    background: 'rgba(0,0,0,0.02)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text)',
    fontSize: '0.9rem',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '1rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'white',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '20px',
            padding: '2.5rem',
            width: '100%', maxWidth: '440px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
          }}
        >
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.8rem', fontWeight: '500',
            color: 'var(--text)', marginBottom: '0.5rem'
          }}>
            {editUser ? 'Modifier' : 'Nouvel'} utilisateur
          </h2>
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, #C9A84C, transparent)', marginBottom: '2rem' }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Photo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden',
                border: '2px solid rgba(201,168,76,0.3)',
                background: '#f0f0f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {preview
                  ? <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Photo</span>
                }
              </div>
              <label style={{
                cursor: 'pointer',
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.3)',
                color: 'var(--gold)', padding: '6px 16px',
                borderRadius: '6px', fontSize: '0.8rem',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                {uploading ? '⏳ Upload...' : '📷 Choisir'}
                <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              </label>
            </div>

            <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.8)'} onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
            <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.8)'} onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'none' }} onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.8)'} onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />

            <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
              <motion.button
                type="submit" disabled={uploading}
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201,168,76,0.3)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
                  border: 'none', color: '#FFFFFF',
                  padding: '12px', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '0.9rem',
                  fontWeight: '500', fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {editUser ? 'Mettre à jour' : 'Ajouter'}
              </motion.button>
              <motion.button
                type="button" onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.02)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  color: 'var(--text-muted)',
                  padding: '12px', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '0.9rem',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Annuler
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}