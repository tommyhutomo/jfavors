'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/* ──────────────────────────────────────────────────────────────
   Types + Hardcoded Data
   ────────────────────────────────────────────────────────────── */
type Tier = 'Exclusive' | 'Premium' | 'Standard' | 'Basic';

interface PackageTier {
  name: string;
  price: number;          // IDR
  description: string;    // comma-separated features
}

interface EventPackageRow {
  eventType: string;
  tiers: Record<Tier, PackageTier>;
}

const DATA: EventPackageRow[] = [
  {
    eventType: 'Wedding',
    tiers: {
      Exclusive: {
        name: 'Exclusive Wedding Platinum',
        price: 150_000_000,
        description:
          'Up to 800 guests, full-day coverage, premium venue styling, dedicated project manager, full production crew, luxury décor, complete audio-visual setup, rehearsal & coordination included',
      },
      Premium: {
        name: 'Wedding Premium Gold',
        price: 100_000_000,
        description:
          'Up to 500 guests, full-day coverage, professional styling, experienced event manager, full AV setup, premium decoration, on-site coordination',
      },
      Standard: {
        name: 'Wedding Standard Silver',
        price: 70_000_000,
        description:
          'Up to 300 guests, standard venue styling, partial-day coverage, essential AV system, standard decoration, on-site supervisor',
      },
      Basic: {
        name: 'Wedding Basic Bronze',
        price: 40_000_000,
        description:
          'Up to 150 guests, basic setup, limited coverage hours, basic sound system, simple decoration, minimal coordination',
      },
    },
  },
  {
    eventType: 'Training',
    tiers: {
      Exclusive: {
        name: 'Executive Training Suite',
        price: 75_000_000,
        description:
          'Up to 200 participants, full-day session, premium training setup, multi-room support, full AV, professional facilitation support, registration & logistics management',
      },
      Premium: {
        name: 'Professional Training Package',
        price: 50_000_000,
        description:
          'Up to 120 participants, full-day training, standard AV setup, training room arrangement, on-site coordinator',
      },
      Standard: {
        name: 'Standard Training Program',
        price: 30_000_000,
        description:
          'Up to 60 participants, half-day session, basic AV setup, classroom-style seating, limited support',
      },
      Basic: {
        name: 'Basic Training Session',
        price: 15_000_000,
        description:
          'Up to 30 participants, short session, basic equipment, minimal setup and support',
      },
    },
  },
  {
    eventType: 'Corporate Events',
    tiers: {
      Exclusive: {
        name: 'Corporate Elite Experience',
        price: 120_000_000,
        description:
          'Up to 600 attendees, full production event, premium staging, LED screens, dedicated event team, branding & registration management',
      },
      Premium: {
        name: 'Corporate Premium Package',
        price: 85_000_000,
        description:
          'Up to 400 attendees, professional staging, standard lighting & sound, event coordination team, branding support',
      },
      Standard: {
        name: 'Corporate Standard Package',
        price: 55_000_000,
        description:
          'Up to 250 attendees, basic stage & sound system, standard setup, on-site supervisor',
      },
      Basic: {
        name: 'Corporate Basic Package',
        price: 30_000_000,
        description:
          'Up to 120 attendees, simple setup, basic sound system, limited event support',
      },
    },
  },
  {
    eventType: 'Exhibitions',
    tiers: {
      Exclusive: {
        name: 'Exhibition Signature Showcase',
        price: 100_000_000,
        description:
          'Large-scale booth, premium design, custom build, lighting, storage, full exhibition crew, setup & teardown included',
      },
      Premium: {
        name: 'Exhibition Premium Booth',
        price: 70_000_000,
        description:
          'Medium booth size, professional design, branding panels, lighting, on-site support',
      },
      Standard: {
        name: 'Exhibition Standard Setup',
        price: 45_000_000,
        description:
          'Standard booth, basic branding, lighting, limited setup support',
      },
      Basic: {
        name: 'Exhibition Basic Setup',
        price: 25_000_000,
        description:
          'Small booth, table & backdrop, minimal setup assistance',
      },
    },
  },
  {
    eventType: 'Product Launches',
    tiers: {
      Exclusive: {
        name: 'Product Launch VIP Experience',
        price: 130_000_000,
        description:
          'Up to 500 guests, premium launch concept, stage & multimedia, influencer/VIP area, full production crew, rehearsals included',
      },
      Premium: {
        name: 'Product Launch Premium Event',
        price: 90_000_000,
        description:
          'Up to 350 guests, professional stage & AV, branded setup, on-site coordination team',
      },
      Standard: {
        name: 'Product Launch Standard Event',
        price: 60_000_000,
        description:
          'Up to 200 guests, standard stage & sound, basic branding, event supervisor',
      },
      Basic: {
        name: 'Product Launch Basic Event',
        price: 35_000_000,
        description:
          'Up to 100 guests, simple setup, basic sound system, limited support',
      },
    },
  },
  {
    eventType: 'Team Building',
    tiers: {
      Exclusive: {
        name: 'Team Building Ultimate Retreat',
        price: 80_000_000,
        description:
          'Up to 150 participants, full-day offsite program, multiple activities, facilitators, logistics & meals coordination',
      },
      Premium: {
        name: 'Team Building Premium Program',
        price: 55_000_000,
        description:
          'Up to 100 participants, full-day activities, facilitators, equipment & coordination',
      },
      Standard: {
        name: 'Team Building Standard Program',
        price: 35_000_000,
        description:
          'Up to 60 participants, half-day activities, basic equipment, limited facilitation',
      },
      Basic: {
        name: 'Team Building Basic Activities',
        price: 20_000_000,
        description:
          'Up to 30 participants, simple activities, minimal equipment & supervision',
      },
    },
  },
  {
    eventType: 'Brand Activations',
    tiers: {
      Exclusive: {
        name: 'Brand Activation Flagship',
        price: 110_000_000,
        description:
          'High-impact activation, premium booth & staging, multimedia, promoters, full branding & reporting',
      },
      Premium: {
        name: 'Brand Activation Premium Campaign',
        price: 80_000_000,
        description:
          'Professional activation setup, branded booth, promoters, audience engagement tools',
      },
      Standard: {
        name: 'Brand Activation Standard Campaign',
        price: 50_000_000,
        description:
          'Standard activation booth, basic branding, limited promoters',
      },
      Basic: {
        name: 'Brand Activation Basic Campaign',
        price: 30_000_000,
        description:
          'Simple activation setup, basic branding, minimal staff',
      },
    },
  },
  {
    eventType: 'Talent & Entertainment',
    tiers: {
      Exclusive: {
        name: 'Talent & Entertainment Exclusive',
        price: 90_000_000,
        description:
          'Top-tier talent lineup, premium stage & lighting, full sound system, technical crew, rehearsal support',
      },
      Premium: {
        name: 'Entertainment Premium Lineup',
        price: 65_000_000,
        description:
          'Professional performers, standard stage & lighting, sound system, on-site coordination',
      },
      Standard: {
        name: 'Entertainment Standard Package',
        price: 40_000_000,
        description:
          'Local talent, basic stage & sound, limited technical support',
      },
      Basic: {
        name: 'Entertainment Basic Package',
        price: 25_000_000,
        description:
          'Single performer or small act, minimal setup, basic sound system',
      },
    },
  },
];

/* ──────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────── */
const ALL: 'All' = 'All';
const TIER_OPTIONS: (Tier | 'All')[] = [ALL, 'Exclusive', 'Premium', 'Standard', 'Basic'];

function formatIDR(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

// Parse comma-separated description into bullet list
function toBullets(desc: string) {
  return desc.split(',').map((s) => s.trim()).filter(Boolean);
}

// Unique key for selected items
function keyFor(eventType: string, tier: Tier) {
  return `${eventType}__${tier}`;
}

type CompareItem = {
  key: string;
  eventType: string;
  tier: Tier;
  name: string;
  price: number;
  features: string[];
};

/* ──────────────────────────────────────────────────────────────
   Named Export Component (matches your other imports)
   ────────────────────────────────────────────────────────────── */
export function EventPackage({
  title = 'Event Packages',
  subtitle = 'Browse by event type, filter by tier, and compare inclusions & pricing.',
  data = DATA,
  maxCompare = 4,
}: {
  title?: string;
  subtitle?: string;
  data?: EventPackageRow[];
  maxCompare?: number;
}) {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<Tier | 'All'>(ALL);

  // Compare state
  const [selected, setSelected] = useState<Record<string, CompareItem>>({});
  const [isCompareOpen, setCompareOpen] = useState(false);
  const compareBtnRef = useRef<HTMLButtonElement | null>(null);

  // Filtered data for the grid
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((row) => {
      if (!q) return true;
      const inEvent = row.eventType.toLowerCase().includes(q);
      const inTiers =
        row.tiers.Exclusive.name.toLowerCase().includes(q) ||
        row.tiers.Premium.name.toLowerCase().includes(q) ||
        row.tiers.Standard.name.toLowerCase().includes(q) ||
        row.tiers.Basic.name.toLowerCase().includes(q) ||
        row.tiers.Exclusive.description.toLowerCase().includes(q) ||
        row.tiers.Premium.description.toLowerCase().includes(q) ||
        row.tiers.Standard.description.toLowerCase().includes(q) ||
        row.tiers.Basic.description.toLowerCase().includes(q);
      return inEvent || inTiers;
    });
  }, [data, query]);

  const selectedItems = useMemo(() => Object.values(selected), [selected]);
  const selectedCount = selectedItems.length;

  // Toggle selection for comparison
  function toggleCompare(row: EventPackageRow, tier: Tier) {
    const pkg = row.tiers[tier];
    const k = keyFor(row.eventType, tier);
    setSelected((prev) => {
      const has = !!prev[k];
      if (has) {
        const { [k]: _, ...rest } = prev;
        return rest;
      }
      if (Object.keys(prev).length >= maxCompare) return prev; // limit
      return {
        ...prev,
        [k]: {
          key: k,
          eventType: row.eventType,
          tier,
          name: pkg.name,
          price: pkg.price,
          features: toBullets(pkg.description),
        },
      };
    });
  }

  // Is selected?
  function isSelected(eventType: string, tier: Tier) {
    return !!selected[keyFor(eventType, tier)];
  }

  // Keyboard: Esc to close modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setCompareOpen(false);
    }
    if (isCompareOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCompareOpen]);

  return (
    <section aria-labelledby="packages-heading" className="mx-auto max-w-7xl p-4 sm:p-6">
      <header className="mb-4 sm:mb-6">
        <h2 id="packages-heading" className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </header>

      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          aria-label="Search packages"
          placeholder="Search events, packages, or features…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:max-w-md"
        />

        <div role="tablist" aria-label="Tier filter" className="inline-flex rounded-md border border-gray-300 p-1">
          {TIER_OPTIONS.map((opt) => {
            const active = tier === opt;
            return (
              <button
                key={opt}
                role="tab"
                aria-selected={active}
                onClick={() => setTier(opt)}
                className={`rounded px-3 py-1.5 text-sm transition ${
                  active ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((row) => (
          <EventCard
            key={row.eventType}
            eventType={row.eventType}
            tier={tier}
            data={row}
            onToggleCompare={toggleCompare}
            isSelected={isSelected}
            canAddMore={selectedCount < maxCompare}
          />
        ))}
      </div>

      {/* Sticky compare bar */}
      {selectedCount >= 2 && (
        <div className="fixed inset-x-0 bottom-4 z-40 mx-auto w-full max-w-3xl px-4">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white/90 p-3 shadow-lg backdrop-blur">
            <div className="text-sm text-gray-700">
              <strong>{selectedCount}</strong> selected for comparison
              <span className="ml-2 hidden sm:inline text-gray-500">
                (max {maxCompare})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                onClick={() => setSelected({})}
              >
                Clear
              </button>
              <button
                ref={compareBtnRef}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setCompareOpen(true)}
              >
                Compare
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare modal */}
      {isCompareOpen && (
        <CompareModal
          items={selectedItems}
          onClose={() => setCompareOpen(false)}
          onRemove={(k) => {
            setSelected((prev) => {
              const { [k]: _, ...rest } = prev;
              return rest;
            });
          }}
          onClear={() => setSelected({})}
        />
      )}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Internals
   ────────────────────────────────────────────────────────────── */
function EventCard({
  eventType,
  tier,
  data,
  onToggleCompare,
  isSelected,
  canAddMore,
}: {
  eventType: string;
  tier: Tier | 'All';
  data: EventPackageRow;
  onToggleCompare: (row: EventPackageRow, tier: Tier) => void;
  isSelected: (eventType: string, tier: Tier) => boolean;
  canAddMore: boolean;
}) {
  const tiersToShow: Tier[] = tier === 'All' ? ['Exclusive', 'Premium', 'Standard', 'Basic'] : [tier];

  return (
    <article className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 p-4">
        <h3 className="text-lg font-semibold">{eventType}</h3>
        {tier === 'All' && <p className="text-xs text-gray-500">Compare all tiers for this event</p>}
      </header>

      {tier === 'All' ? (
        <div className="grid grid-cols-1 gap-3 p-4">
          {tiersToShow.map((t) => (
            <TierRow
              key={t}
              label={t}
              pkg={data.tiers[t]}
              selected={isSelected(eventType, t)}
              onToggle={() => onToggleCompare(data, t)}
              canAddMore={canAddMore}
            />
          ))}
        </div>
      ) : (
        <div className="p-4">
          <TierPanel
            label={tiersToShow[0]}
            pkg={data.tiers[tiersToShow[0]]}
            selected={isSelected(eventType, tiersToShow[0])}
            onToggle={() => onToggleCompare(data, tiersToShow[0])}
            canAddMore={canAddMore}
          />
        </div>
      )}
    </article>
  );
}

function TierRow({
  label,
  pkg,
  selected,
  onToggle,
  canAddMore,
}: {
  label: Tier | string;
  pkg: { name: string; price: number; description: string };
  selected: boolean;
  onToggle: () => void;
  canAddMore: boolean;
}) {
  const disabled = !selected && !canAddMore;

  return (
    <div className="rounded-md border border-gray-200 p-3 hover:bg-gray-50">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h4 className="font-medium">{label}</h4>
        <div className="text-sm font-semibold text-indigo-600">{formatIDR(pkg.price)}</div>
      </div>
      <div className="text-sm font-medium text-gray-800">{pkg.name}</div>
      <p className="mt-1 text-xs text-gray-600 line-clamp-3">{pkg.description}</p>

      <div className="mt-3 flex items-center justify-end">
        <button
          className={`rounded-md border px-3 py-1.5 text-xs transition ${
            selected
              ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
              : disabled
              ? 'cursor-not-allowed border-gray-200 text-gray-400'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
          onClick={onToggle}
          disabled={disabled}
          aria-pressed={selected}
        >
          {selected ? 'Remove from Compare' : 'Add to Compare'}
        </button>
      </div>
    </div>
  );
}

function TierPanel({
  label,
  pkg,
  selected,
  onToggle,
  canAddMore,
}: {
  label: Tier | string;
  pkg: { name: string; price: number; description: string };
  selected: boolean;
  onToggle: () => void;
  canAddMore: boolean;
}) {
  const bullets = toBullets(pkg.description);
  const disabled = !selected && !canAddMore;

  return (
    <div className="rounded-md border border-gray-200 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="text-base font-semibold">{label}</h4>
        <span className="text-base font-bold text-indigo-600">{formatIDR(pkg.price)}</span>
      </div>
      <div className="text-sm font-medium text-gray-800">{pkg.name}</div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-end">
        <button
          className={`rounded-md border px-3 py-2 text-sm transition ${
            selected
              ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
              : disabled
              ? 'cursor-not-allowed border-gray-200 text-gray-400'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
          onClick={onToggle}
          disabled={disabled}
          aria-pressed={selected}
        >
          {selected ? 'Remove from Compare' : 'Add to Compare'}
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Comparison Modal
   ────────────────────────────────────────────────────────────── */
function CompareModal({
  items,
  onClose,
  onRemove,
  onClear,
}: {
  items: CompareItem[];
  onClose: () => void;
  onRemove: (key: string) => void;
  onClear: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Compare packages"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-t-xl bg-white shadow-2xl sm:rounded-xl"
      >
        <div className="flex items-center justify-between border-b p-3 sm:p-4">
          <h3 className="text-lg font-semibold">Compare Packages</h3>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
              onClick={onClear}
            >
              Clear All
            </button>
            <button
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        {/* Scroll container */}
        <div className="overflow-x-auto">
          <div
            className="grid min-w-[720px] grid-cols-1 gap-0 md:min-w-[900px]"
            style={{ gridTemplateColumns: `200px repeat(${items.length}, minmax(220px, 1fr))` }}
          >
            {/* Left header column */}
            <div className="sticky left-0 z-10 bg-white p-3 text-sm font-semibold text-gray-700">
              Attribute
            </div>
            {items.map((it) => (
              <div key={it.key} className="flex items-center justify-between gap-2 border-b p-3">
                <div className="text-sm font-semibold">{it.tier}</div>
                <button
                  className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                  onClick={() => onRemove(it.key)}
                  aria-label={`Remove ${it.name} from comparison`}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Event Type */}
            <div className="sticky left-0 z-10 border-t bg-white p-3 text-sm font-medium text-gray-700">
              Event Type
            </div>
            {items.map((it) => (
              <div key={it.key + 'type'} className="border-t p-3 text-sm">
                {it.eventType}
              </div>
            ))}

            {/* Package Name */}
            <div className="sticky left-0 z-10 border-t bg-white p-3 text-sm font-medium text-gray-700">
              Package
            </div>
            {items.map((it) => (
              <div key={it.key + 'name'} className="border-t p-3 text-sm font-medium text-gray-900">
                {it.name}
              </div>
            ))}

            {/* Price */}
            <div className="sticky left-0 z-10 border-t bg-white p-3 text-sm font-medium text-gray-700">
              Price
            </div>
            {items.map((it) => (
              <div key={it.key + 'price'} className="border-t p-3 text-sm font-semibold text-indigo-600">
                {formatIDR(it.price)}
              </div>
            ))}

            {/* Features */}
            <div className="sticky left-0 z-10 border-t bg-white p-3 text-sm font-medium text-gray-700">
              Features
            </div>
            {items.map((it) => (
              <div key={it.key + 'features'} className="border-t p-3 text-sm">
                <ul className="list-disc space-y-1 pl-5">
                  {it.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t p-3 sm:p-4">
          <button
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            onClick={() => {
              window.open('https://linktr.ee/jfavors.eo', '_blank', 'noopener,noreferrer');
            }}
          >
            Proceed to Inquiry
          </button>
        </div>
      </div>
    </div>
  );
}