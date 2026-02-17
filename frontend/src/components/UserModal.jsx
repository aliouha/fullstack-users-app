import { useState, useEffect } from 'react'

const API_URL = 'http://192.168.1.14'

export default function UserModal({ onClose, onSave, editUser }) {
  const [form, setForm] = useState({
    photo: '', nom: '', prenom: '', description: ''
  })
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (editUser) {
      setForm(editUser)
      setPreview(editUser.photo || null)
    }
  }, [editUser])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview local
    setPreview(URL.createObjectURL(file))

    // Upload vers le serveur
    setUploading(true)
    const formData = new FormData()
    formData.append('photo', file)

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      setForm(prev => ({ ...prev, photo: data.url }))
    } catch (err) {
      console.error('Erreur upload:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {editUser ? 'Modifier' : 'Ajouter'} un utilisateur
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Photo upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 bg-gray-100 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">Photo</span>
              )}
            </div>
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
              {uploading ? '⏳ Upload...' : '📷 Choisir une photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
            </label>
          </div>

          <input
            name="prenom"
            placeholder="Prénom"
            value={form.prenom}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
            >
              {editUser ? 'Mettre à jour' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}