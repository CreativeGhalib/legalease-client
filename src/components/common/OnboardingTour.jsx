import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useOnboarding } from '../../hooks/useOnboarding'

export default function OnboardingTour({ tourKey, steps, enabled = true, autoStartDelay = 800 }) {
  const { completed, markComplete } = useOnboarding(tourKey)
  const reduceMotion = useReducedMotion()
  const startedRef = useRef(false)

  useEffect(() => {
    if (!enabled || completed || startedRef.current || !steps.length) return undefined

    const timer = setTimeout(() => {
      const allTargetsExist = steps.every((step) => !step.element || document.querySelector(step.element))
      if (!allTargetsExist) {
        markComplete()
        return
      }

      startedRef.current = true
      const driverInstance = driver({
        animate: !reduceMotion,
        allowClose: true,
        closeBtnText: 'Skip tour',
        doneBtnText: 'Finish',
        nextBtnText: 'Next',
        prevBtnText: 'Back',
        showProgress: true,
        progressText: '{{current}} of {{total}}',
        steps,
        onDestroyed: () => markComplete(),
      })
      driverInstance.drive()
    }, autoStartDelay)

    return () => clearTimeout(timer)
  }, [autoStartDelay, completed, enabled, markComplete, reduceMotion, steps])

  return null
}
