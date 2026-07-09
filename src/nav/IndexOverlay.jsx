// The recruiter escape hatch: everything on the site as a plain text list,
// one click from anywhere.

import { sections } from '../world/worldMap';
import { projects } from '../content/projects';
import { experience } from '../content/experience';
import { contact } from '../content/contact';

export default function IndexOverlay({ open, onClose }) {
  if (!open) return null;
  return (
    <div
      className="bg-paper fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-label="site index"
    >
      <button
        onClick={onClose}
        className="font-hand text-ink-soft hover:text-sanguine fixed top-5 right-6 cursor-pointer text-[17px]"
      >
        close ✕
      </button>
      <div className="mx-auto grid max-w-3xl gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <h2 className="font-display mb-4 text-2xl lowercase">sections</h2>
          <ul className="space-y-2 text-lg">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={s.hash ? `#/${s.hash}` : '#/'}
                  onClick={onClose}
                  className="underline decoration-1 underline-offset-4 hover:text-sanguine"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <h2 className="font-display mt-8 mb-4 text-2xl lowercase">contact</h2>
          <ul className="space-y-2 text-lg">
            <li>
              <a className="underline decoration-1 underline-offset-4 hover:text-sanguine" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </li>
            <li>
              <a className="underline decoration-1 underline-offset-4 hover:text-sanguine" href={contact.github}>github</a>
            </li>
            <li>
              <a className="underline decoration-1 underline-offset-4 hover:text-sanguine" href={contact.linkedin}>linkedin</a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-display mb-4 text-2xl lowercase">projects</h2>
          <ul className="space-y-2 text-lg">
            {projects.map((p) => (
              <li key={p.id}>
                {p.name} ·{' '}
                {p.links.map((l, i) => (
                  <span key={l.href}>
                    {i > 0 && ' · '}
                    <a href={l.href} className="underline decoration-1 underline-offset-4 hover:text-sanguine">
                      {l.label}
                    </a>
                  </span>
                ))}
              </li>
            ))}
          </ul>
          <h2 className="font-display mt-8 mb-4 text-2xl lowercase">work</h2>
          <ul className="space-y-2 text-lg">
            {experience.map((e) => (
              <li key={e.id}>
                {e.link ? (
                  <a href={e.link} className="underline decoration-1 underline-offset-4 hover:text-sanguine">
                    {e.company}
                  </a>
                ) : (
                  e.company
                )}{' '}
                · {e.role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
