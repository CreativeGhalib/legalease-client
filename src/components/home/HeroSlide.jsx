export default function HeroSlide({ as: Heading = 'h2', eyebrow, title, children, footer }) {
  return (
    <div className="h-full py-2">
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.18em] text-[#d4a843] sm:text-sm">{eyebrow}</p>
      )}
      <Heading className="mt-3 break-words text-2xl font-semibold tracking-tight text-white sm:mt-4 sm:text-4xl md:text-5xl">
        {title}
      </Heading>
      {children && (
        <div className="mt-4 max-w-xl text-sm leading-7 text-[#96a8b8] sm:text-base">{children}</div>
      )}
      {footer && <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">{footer}</div>}
    </div>
  )
}
