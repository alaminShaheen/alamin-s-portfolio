"use client";

import { useEffect, useState } from "react";

// UTC offset (in minutes) of an IANA timezone at a given moment, DST-aware.
function zoneOffset(timeZone: string, date: Date) {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

function describeGap(minutes: number) {
  if (minutes === 0) return "same timezone as you";
  const abs = Math.abs(minutes);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  const amount = [hours && `${hours}h`, mins && `${mins}m`].filter(Boolean).join(" ");
  return minutes > 0 ? `you're ${amount} ahead of me` : `you're ${amount} behind me`;
}

export function LocalTime({ timeZone, place }: { timeZone: string; place: string }) {
  // Rendered only on the client, since the visitor's timezone is unknown on the server.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <p className="local-time">&nbsp;</p>;

  const time = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" })
    .format(now)
    .toLowerCase();
  const gap = -now.getTimezoneOffset() - zoneOffset(timeZone, now);

  return (
    <p className="local-time">
      <time dateTime={now.toISOString()}>{time}</time> in {place}, {describeGap(gap)}
    </p>
  );
}
