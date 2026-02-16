export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm">U</div>
        <span className="text-xl font-bold tracking-wide">UserManager</span>
      </div>
      <span className="text-gray-400 text-sm">Gestion des utilisateurs</span>
    </nav>
  )
}