import { useEffect, useState } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import { useAuthStore } from '../../stores/authStore'
import { Users, Share2, Crown, User } from 'lucide-react'

export default function MembersPanel({ projectId }) {
  const { members, fetchMembers, getInviteLink } = useProjectStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (projectId) {
      fetchMembers(projectId)
    }
  }, [projectId, fetchMembers])

  const handleInvite = async () => {
    setLoading(true)
    try {
      await getInviteLink(projectId)
    } catch (error) {
      console.error('Error al generar enlace:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary-600" />
          <span>Miembros del Proyecto</span>
        </h3>
        <button
          onClick={handleInvite}
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Invitar Miembros</span>
            </>
          )}
        </button>
      </div>

      <div className="card">
        {members.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No hay miembros aún
            </h4>
            <p className="text-gray-600 mb-6">
              Invita a otros usuarios para colaborar en este proyecto
            </p>
            <button
              onClick={handleInvite}
              className="btn-primary"
            >
              Invitar Primer Miembro
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.usuarioId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {member.usuario.nombre}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {member.usuario.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.rol === 'owner' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {member.rol === 'owner' && <Crown className="w-3 h-3 inline mr-1" />}
                    {member.rol === 'owner' ? 'Propietario' : 'Miembro'}
                  </span>
                  
                  {user && member.usuarioId === user.firebase_uid && (
                    <span className="text-xs text-gray-500">(Tú)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}