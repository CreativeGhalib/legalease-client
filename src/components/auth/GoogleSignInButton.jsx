import { useEffect, useRef, useState } from 'react'

const GOOGLE_GIS_SCRIPT = 'https://accounts.google.com/gsi/client'

function loadGoogleIdentityServices() {
  if (window.google?.accounts?.id) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${GOOGLE_GIS_SCRIPT}"]`)
    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Google sign-in could not be loaded.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = GOOGLE_GIS_SCRIPT
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Google sign-in could not be loaded.'))
    document.head.append(script)
  })
}

export default function GoogleSignInButton({ onCredential, text = 'signin_with', disabled = false }) {
  const containerRef = useRef(null)
  const [loadError, setLoadError] = useState('')
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId || disabled || !containerRef.current) return undefined
    let active = true

    loadGoogleIdentityServices()
      .then(() => {
        if (!active || !window.google?.accounts?.id) return
        containerRef.current.replaceChildren()
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => { void onCredential(response.credential) },
          auto_select: false,
          cancel_on_tap_outside: true,
        })
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'rectangular',
          width: containerRef.current.offsetWidth || 320,
        })
      })
      .catch((error) => {
        if (active) setLoadError(error.message)
      })

    return () => { active = false }
  }, [clientId, disabled, onCredential, text])

  if (!clientId) return null
  if (loadError) return <p role="alert" className="text-sm text-red-700">Google sign-in is currently unavailable. Please use email and password.</p>
  return <div ref={containerRef} className={disabled ? 'pointer-events-none opacity-60' : ''} />
}
