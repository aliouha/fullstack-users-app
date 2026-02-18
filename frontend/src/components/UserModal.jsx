import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = 'http://192.168.1.14'

export default function UserModal({ onClose, onSave, editUser }) {
  const [form, setForm] = useState({ photo: '', nom: '', prenom: '', description: '' })
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)

  useEffect(() => {
    if (editUser) { 
      setForm(editUser); 
      // Construire l'URL complète pour le preview
      const photoUrl = editUser.photo?.startsWith('http') 
        ? editUser.photo 
        : editUser.photo ? `${API_URL}${editUser.photo}` : null;
      setPreview(photoUrl);
    }
  }, [editUser])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setPhotoFile(file)
  }

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    // Envoyer le fichier au lieu de l'URL
    onSave({ ...form, photo: photoFile }) 
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
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '1rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'white',
            border: '1px solid rgba(74, 144, 226, 0.2)',
            borderRadius: '24px',
            padding: '2.5rem',
            width: '100%', maxWidth: '460px',
            boxShadow: '0 50px 100px rgba(74, 144, 226, 0.15)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem', fontWeight: '500',
              color: 'var(--text)', marginBottom: '0.5rem'
            }}>
              {editUser ? 'Modifier' : 'Nouvel'} utilisateur
            </h2>
            <div style={{ 
              width: '60px', 
              height: '3px', 
              background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', 
              margin: '0 auto',
              borderRadius: '2px'
            }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Photo avec bordure animée */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '100px', 
                height: '100px', 
                borderRadius: '50%',
                position: 'relative',
                background: 'linear-gradient(135deg, #4A90E2, #67B5FF, #4A90E2)',
                backgroundSize: '200% 200%',
                padding: '4px',
                animation: 'gradientShift 3s ease infinite',
              }}>
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
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {preview ? (
                    <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Photo</span>
                  )}
                </div>
              </div>
              <label style={{
                cursor: 'pointer',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                border: 'none',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '500',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(74, 144, 226, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(74, 144, 226, 0.3)';
              }}
              >
                {uploading ? '⏳ Upload...' : '📷 Choisir une photo'}
                <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              </label>
            </div>

            <input 
              name="prenom" 
              placeholder="Prénom" 
              value={form.prenom} 
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
              name="nom" 
              placeholder="Nom" 
              value={form.nom} 
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
            <textarea 
              name="description" 
              placeholder="Description" 
              value={form.description} 
              onChange={handleChange} 
              rows={4} 
              style={{ ...inputStyle, resize: 'none' }} 
              onFocus={e => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.background = 'rgba(74, 144, 226, 0.08)';
              }} 
              onBlur={e => {
                e.target.style.borderColor = 'rgba(74, 144, 226, 0.2)';
                e.target.style.background = 'rgba(74, 144, 226, 0.05)';
              }} 
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
              <motion.button
                type="submit" 
                disabled={uploading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                  border: 'none', 
                  color: 'white',
                  padding: '14px', 
                  borderRadius: '10px',
                  cursor: uploading ? 'not-allowed' : 'pointer', 
                  fontSize: '0.95rem',
                  fontWeight: '600', 
                  fontFamily: 'DM Sans, sans-serif',
                  boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
                  opacity: uploading ? 0.7 : 1,
                }}
              >
                {editUser ? '✓ Mettre à jour' : '+ Ajouter'}
              </motion.button>
              <motion.button
                type="button" 
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  color: 'var(--text-muted)',
                  padding: '14px', 
                  borderRadius: '10px',
                  cursor: 'pointer', 
                  fontSize: '0.95rem',
                  fontWeight: '500',
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