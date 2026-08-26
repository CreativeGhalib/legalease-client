import { useParams } from 'react-router-dom'
import BrowseLawyersPage from './BrowseLawyersPage'
import NotFoundPage from '../errors/NotFoundPage'
import { setSeo } from '../../utils/seo'
import { CATEGORY_SLUGS } from '../../utils/schema'
import { useEffect } from 'react'

export default function CategoryLandingPage() {
  const { categorySlug } = useParams()
  const specialization = CATEGORY_SLUGS[categorySlug]

  useEffect(() => {
    if (specialization) {
      setSeo({
        title: `${specialization} lawyers in Dhaka — LegalEase`,
        description: `Browse verified ${specialization.toLowerCase()} lawyers on LegalEase. Compare fees, experience, and availability.`,
      })
    }
  }, [specialization])

  if (!specialization) return <NotFoundPage />

  return (
    <div>
      <section className="rounded-2xl border border-[#d8ccb8] bg-[#fdf9f2] p-6 dark:border-[#2a3850] dark:bg-[#161d27] sm:p-8">
        <p className="text-sm font-semibold tracking-[0.16em] text-[#1b3a6b] dark:text-[#d4a843]">
          LEGAL SPECIALTY
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0c1827] dark:text-[#e4d9c5] sm:text-4xl">
          Find {specialization} lawyers in Dhaka
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-[#364358] dark:text-[#96a8b8]">
          Every profile below is verified, paid, and currently published on LegalEase. Compare
          consultation fees and availability before you hire.
        </p>
      </section>
      <BrowseLawyersPage presetSpecialization={specialization} />
    </div>
  )
}
