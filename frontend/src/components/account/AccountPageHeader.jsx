import React from 'react'

function AccountPageHeader({ title, description, meta, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#2f3840]">{title}</h1>
        {description && (
          <p className="text-sm text-[#7d8794] mt-1">{description}</p>
        )}
        {meta && (
          <p className="text-sm text-[#d71920] mt-2 font-medium">{meta}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export default AccountPageHeader
