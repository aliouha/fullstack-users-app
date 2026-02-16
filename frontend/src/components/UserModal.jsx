
import { useState, useEffect } from 'react'

export default function UserModal({ onClose, onSave, editUser }) {
  const [form, setForm] = useState({
    photo: '', nom: '', prenom: '', description: ''
  })

  useEffect(() => {
    if (editUser) setForm(editUser)
  }, [editUser])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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
          <input
            name="photo"
            placeholder="URL de la photo (optionnel)"
            value={form.photo}
            onChange={handleChange}
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
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
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