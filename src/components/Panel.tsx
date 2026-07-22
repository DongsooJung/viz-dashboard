import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  titleHref: string
  subtitle?: string
  badge?: string
  children: ReactNode
}

export default function Panel({ title, titleHref, subtitle, badge, children }: PanelProps) {
  return (
    <section className="panel">
      <header className="panel__head">
        <div>
          <h2 className="panel__title">
            <a href={titleHref} target="_blank" rel="noreferrer">
              {title}
            </a>
          </h2>
          {subtitle && <p className="panel__subtitle">{subtitle}</p>}
        </div>
        {badge && <span className="panel__badge">{badge}</span>}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  )
}
