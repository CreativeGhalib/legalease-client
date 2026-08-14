import useModalFocus from '../../hooks/useModalFocus'

export default function ModalFocusRegion({ children, className, closeOnEscape = true, label, labelledBy, onClose }) {
  const regionRef = useModalFocus(true, onClose, closeOnEscape)
  return <div ref={regionRef} role="dialog" aria-modal="true" aria-label={label} aria-labelledby={labelledBy} className={className}>{children}</div>
}
