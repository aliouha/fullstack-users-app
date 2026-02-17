import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import UserCard from './components/UserCard'
import UserModal from './components/UserModal'

const API = 'http://192.168.1.14/api/users'

export default function App() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState(null)

  const fetchUsers = async () => {
    const res = await fetch(API)
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSave = async (form) => {
    if (editUser) {
      await fetch(`${API}/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    } else {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setShowModal(false)
    setEditUser(null)
    fetchUsers()
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    fetchUsers()
  }

  const handleEdit = (user) => {
    setEditUser(user)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Utilisateurs <span className="text-blue-500">({users.length})</span>
          </h1>
          <button
            onClick={() => { setEditUser(null); setShowModal(true) }}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            + Ajouter
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center text-gray-400 mt-20 text-lg">
            Je teste Aucun utilisateur pour l'instant. Cliquez sur "+ Ajouter" !
          </div>
        )}
      </main>

      {showModal && (
        <UserModal
          onClose={() => { setShowModal(false); setEditUser(null) }}
          onSave={handleSave}
          editUser={editUser}
        />
      )}
    </div>
  )
}