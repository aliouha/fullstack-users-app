export default function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-3 hover:shadow-xl transition-shadow">
      <img
        src={user.photo || 'https://api.dicebear.com/7.x/initials/svg?seed=' + user.prenom}
        alt={user.nom}
        className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
      />
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800">{user.prenom} {user.nom}</h2>
        <p className="text-gray-500 text-sm mt-1">{user.description}</p>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onEdit(user)}
          className="px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
        >
          Supprimer
        </button>
      </div>
    </div>
  )
}