import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '../stores/projectStore'
import { useAuthStore } from '../stores/authStore'
import { Users, CheckCircle, XCircle } from 'lucide-react'

export default function JoinProject() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { joinProject } = useProjectStore()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleJoin = async () => {
      if (!user) {
        navigate('/login')
        return
      }

      try {
        const result = await joinProject(token, user.firebase_uid)
        setStatus('success')
        setMessage('Te has unido al proyecto correctamente')
        
        // Redirigir al proyecto después de 2 segundos
        setTimeout(() => {
          navigate(`/project/${result.proyecto.id}`)
        }, 2000)
      } catch (error) {
        setStatus('error')
        setMessage(error.message || 'Error al unirse al proyecto')
      }
    }

    if (token && user) {
      handleJoin()
    }
  }, [token, user, joinProject, navigate])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100">
        <div className="card max-w-md mx-auto text-center">
          <Users className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unirse al Proyecto
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas iniciar sesión para unirte a este proyecto
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary w-full"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="card max-w-md mx-auto text-center animate-fade-in">
        {status === 'loading' && (
          <>
            <div className="loading-spinner mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Uniéndote al proyecto...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras procesamos tu solicitud
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Éxito!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Serás redirigido al proyecto en unos segundos...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="btn-primary w-full"
              >
                Volver al inicio
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary w-full"
              >
                Intentar de nuevo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}