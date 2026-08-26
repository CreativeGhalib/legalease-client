import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LANG_STORAGE_KEY } from '../../i18n/i18n'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'bn', label: 'বাংলা' },
]

export default function LanguageSwitcher({ compact = false }) {
  const { i18n } = useTranslation()
  const active = i18n.language?.startsWith('bn') ? 'bn' : 'en'

  useEffect(() => {
    document.documentElement.lang = active
    return () => undefined
  }, [active])

  function switchTo(code) {
    if (code === active) return
    void i18n.changeLanguage(code)
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, code)
    } catch {
      /* private mode */
    }
    document.documentElement.lang = code
  }

  return (
    <div role="group" aria-label="Language" className={`inline-flex overflow-hidden rounded-lg border border-[#c5b89e] dark:border-[#374c62] ${compact ? '' : 'min-h-11'}`}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          aria-pressed={active === code}
          onClick={() => switchTo(code)}
          className={`px-3 text-xs font-bold transition ${
            compact ? 'min-h-9' : 'min-h-11 min-w-12'
          } ${
            active === code
              ? 'bg-[#1b3a6b] text-white dark:bg-[#d4a843]/20 dark:text-[#d4a843]'
              : 'bg-transparent text-[#364358] hover:bg-[#e5dccf] dark:text-[#96a8b8] dark:hover:bg-[#22303e]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
