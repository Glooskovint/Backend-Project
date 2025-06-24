import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '../../stores/projectStore'
import { useAuthStore } from '../../stores/authStore'
import { X } from 'lucide-react'

export default function JoinProjectModal({ isOpen, onClose }) {
  const [inviteLink, setInviteLink] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { joinProject } = useProjectStore()

  const handleJoin = async () => {
    try {
      const url = new URL(inviteLink)
      const token = url.pathname.split('/').pop()
      const result = await joinProject(token, user.firebase_uid)
      navigate(`/project/${result.proyecto.id}`)
      onClose()
    } catch (err) {
      setError('Enlace inválido o error al unirse al proyecto')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Unirse a un Proyecto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        <input
          type="text"
          value={inviteLink}
          onChange={(e) => setInviteLink(e.target.value)}
          placeholder="Pega aquí el enlace de invitación"
          className="input w-full mb-3"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleJoin} className="btn-primary">Unirse</button>
        </div>
      </div>
    </div>
  )
}
