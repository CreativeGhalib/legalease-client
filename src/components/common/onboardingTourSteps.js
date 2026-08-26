export const USER_TOUR_STEPS = [
  {
    element: '[data-tour="browse-search"]',
    popover: { title: 'Search by name or expertise', description: 'Type a lawyer’s name or a practice area — results refine as you type.' },
  },
  {
    element: '[data-tour="browse-filters"]',
    popover: { title: 'Filter what matters', description: 'Narrow by specialization, consultation fee range, and current availability.' },
  },
  {
    element: '[aria-label*="shortlist"]',
    popover: { title: 'Shortlist for later', description: 'The heart saves any lawyer to your personal shortlist — it works even before you sign in.' },
  },
  {
    element: 'a[href^="/lawyers/"]',
    popover: { title: 'Open a profile to hire', description: 'Inside a profile you can send a hiring request. The lawyer accepts first; payment unlocks afterwards.' },
  },
]

export const LAWYER_TOUR_STEPS = [
  {
    element: '[data-tour="profile-photo-button"]',
    popover: { title: 'Add your professional photo', description: 'A clear portrait is required before publishing and builds client trust.' },
  },
  {
    element: '[data-tour="profile-fee-input"]',
    popover: { title: 'Set your consultation fee', description: 'This USD amount becomes the fixed fee clients pay after you accept their request.' },
  },
  {
    element: '[data-tour="profile-license-input"]',
    popover: { title: 'Bar Council details', description: 'Your license number and branch complete the publishing requirements.' },
  },
  {
    element: '[data-tour="verification-panel"]',
    popover: { title: 'Verify, then publish', description: 'Pay the one-time verification fee from this panel — after that, publishing your profile is always your choice.' },
  },
]
