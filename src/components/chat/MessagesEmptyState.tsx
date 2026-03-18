import Link from 'next/link';

export default function MessagesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 px-6 text-center">
      {/* Travel / backpack SVG illustration — pink outline style matching design */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 260 180"
        className="w-56 h-40 opacity-90"
        fill="none"
        aria-hidden="true"
      >
        {/* Map / document left */}
        <rect x="18" y="70" width="52" height="68" rx="4" stroke="#e879a0" strokeWidth="2" />
        <line x1="30" y1="85" x2="58" y2="85" stroke="#e879a0" strokeWidth="1.5" />
        <line x1="30" y1="95" x2="52" y2="95" stroke="#e879a0" strokeWidth="1.5" />
        <line x1="30" y1="105" x2="56" y2="105" stroke="#e879a0" strokeWidth="1.5" />
        {/* Pin on map */}
        <circle cx="44" cy="58" r="5" stroke="#e879a0" strokeWidth="2" />
        <line x1="44" y1="63" x2="44" y2="72" stroke="#e879a0" strokeWidth="2" />
        {/* Diamond sparkle top-left */}
        <path d="M22 46 L26 52 L22 58 L18 52 Z" stroke="#e879a0" strokeWidth="1.5" />

        {/* Backpack body */}
        <rect x="88" y="54" width="84" height="90" rx="12" stroke="#e879a0" strokeWidth="2.2" />
        {/* Backpack top / handle */}
        <path d="M108 54 C108 42 152 42 152 54" stroke="#e879a0" strokeWidth="2.2" fill="none" />
        <rect x="122" y="38" width="16" height="10" rx="5" stroke="#e879a0" strokeWidth="2" />
        {/* Front pocket */}
        <rect x="102" y="100" width="56" height="34" rx="6" stroke="#e879a0" strokeWidth="2" />
        {/* Pocket zip line */}
        <line x1="115" y1="100" x2="145" y2="100" stroke="#e879a0" strokeWidth="2" />
        {/* Buckle buttons */}
        <rect x="115" y="72" width="12" height="8" rx="2" stroke="#e879a0" strokeWidth="1.5" />
        <rect x="133" y="72" width="12" height="8" rx="2" stroke="#e879a0" strokeWidth="1.5" />
        {/* Strap */}
        <line x1="130" y1="54" x2="130" y2="72" stroke="#e879a0" strokeWidth="2" />

        {/* Photo / card right of backpack */}
        <rect x="186" y="80" width="44" height="34" rx="4" stroke="#e879a0" strokeWidth="1.8" />
        <circle cx="196" cy="91" r="5" stroke="#e879a0" strokeWidth="1.5" />
        <path d="M186 104 L198 96 L208 106 L216 100 L230 114" stroke="#e879a0" strokeWidth="1.5" />

        {/* Coffee cup bottom right */}
        <path
          d="M196 128 L200 148 L222 148 L226 128 Z"
          stroke="#e879a0"
          strokeWidth="1.8"
          fill="none"
        />
        <path d="M226 133 C233 133 233 143 226 143" stroke="#e879a0" strokeWidth="1.8" fill="none" />
        <line x1="196" y1="128" x2="226" y2="128" stroke="#e879a0" strokeWidth="2" />
        {/* Steam */}
        <path d="M207 122 C207 116 212 118 212 122" stroke="#e879a0" strokeWidth="1.5" fill="none" />
        <path d="M216 122 C216 115 221 118 221 122" stroke="#e879a0" strokeWidth="1.5" fill="none" />
      </svg>

      <h2 className="text-lg font-bold text-gray-900">No messages!</h2>

      <p className="text-sm text-gray-500">
        Relax or go{' '}
        <Link
          href="/"
          className="text-rose-500 font-semibold hover:underline transition-colors"
        >
          explore some more things to do.
        </Link>
      </p>
    </div>
  );
}
