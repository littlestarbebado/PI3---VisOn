import React from 'react';

export function LoadingState({ label = 'A carregar dados…', compact = false }) {
  return (
    <div className={`ui-state ui-state--loading ${compact ? 'ui-state--compact' : ''}`} role="status" aria-live="polite">
      <span className="ui-spinner" aria-hidden="true" />
      <span>{label}</span>
      <div className="ui-skeleton-lines" aria-hidden="true"><i /><i /><i /></div>
    </div>
  );
}

export function EmptyState({ icon = 'bi-inbox', title = 'Sem dados para apresentar', description, action }) {
  return (
    <div className="ui-state ui-state--empty">
      <span className="ui-state__icon" aria-hidden="true"><i className={`bi ${icon}`} /></span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
