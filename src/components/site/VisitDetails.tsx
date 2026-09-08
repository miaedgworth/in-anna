import { addressLines, business } from "@/lib/business";

/** The opening-hours table, rendered from the same structured data as the schema markup. */
export function HoursTable() {
  const rows = [
    ...business.hours.flatMap((h) =>
      h.days.map((day) => ({ day, value: `${format(h.opens)} – ${format(h.closes)}` })),
    ),
    ...business.closedDays.map((day) => ({ day, value: "Closed" })),
  ];

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Opening hours for {business.name}</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.day} className="border-b border-line/70 last:border-0">
            <th scope="row" className="py-3 pr-4 font-sans text-sm font-normal">
              {row.day}
            </th>
            <td
              className={`py-3 text-right text-sm ${
                row.value === "Closed" ? "text-charcoal-muted" : ""
              }`}
            >
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function format(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h < 12 ? "am" : "pm";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

export function AddressBlock() {
  return (
    <address className="not-italic leading-8">
      {addressLines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
      <span className="mt-4 block">
        <a className="transition-colors hover:text-rose-dark" href={`tel:${business.phone}`}>
          {business.phoneDisplay}
        </a>
      </span>
      <span className="block">
        <a className="transition-colors hover:text-rose-dark" href={`mailto:${business.email}`}>
          {business.email}
        </a>
      </span>
    </address>
  );
}

/**
 * Plain Google Maps iframe. Loaded lazily so it costs nothing until it is
 * scrolled into view.
 */
export function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <iframe
      title={`Map showing ${business.name}, ${business.street}, ${business.locality}`}
      src={`https://www.google.com/maps?q=${business.mapsEmbedQuery}&z=17&output=embed`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={`h-full w-full border-0 ${className}`}
    />
  );
}
