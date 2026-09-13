import React from 'react'
import { Link } from 'react-router-dom'

function EmptyState({ title, description, actionLabel, to = '/', onAction, compact = false }) {
  const actionClass = 'inline-flex items-center justify-center px-5 py-2.5 bg-[#d71920] text-white text-sm font-medium rounded-lg hover:bg-[#c6171e] transition-colors'

  return (
    <div className={`bg-white rounded-xl border border-[#e5e7eb] text-center ${compact ? 'p-8' : 'p-10 sm:p-12'}`}>
      <p className="text-base font-medium text-[#2f3840]">{title}</p>
      {description && (
        <p className="text-sm text-[#7d8794] mt-2">{description}</p>
      )}
      {actionLabel && (
        onAction ? (
          <button type="button" onClick={onAction} className={`${actionClass} mt-6`}>
            {actionLabel}
          </button>
        ) : (
          <Link to={to} className={`${actionClass} mt-6`}>
            {actionLabel}
          </Link>
        )
      )}
    </div>
  )
}

export default EmptyState
