"use client";

import { useEffect, useMemo, useState } from "react";

type Props = Readonly<{
  latitude: number | null | undefined;
  longitude: number | null | undefined;
}>;

type ReverseGeoResponse = {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
};

const locationCache = new Map<string, string>();

function toCoordsKey(latitude: number, longitude: number) {
  return `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
}

function toCoordsLabel(latitude: number, longitude: number) {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

function pickBestLabel(data: ReverseGeoResponse): string | null {
  const place = data.city || data.locality;
  const state = data.principalSubdivision;

  if (place && state) return `${place}, ${state}`;
  if (place) return place;
  if (state) return state;
  if (data.countryName) return data.countryName;
  return null;
}

export function LocationName({ latitude, longitude }: Props) {
  const hasCoords = latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined;

  const coordsLabel = useMemo(() => {
    if (!hasCoords) return "—";
    return toCoordsLabel(latitude, longitude);
  }, [hasCoords, latitude, longitude]);

  const [label, setLabel] = useState<string>(coordsLabel);

  useEffect(() => {
    if (!hasCoords) {
      setLabel("—");
      return;
    }

    const key = toCoordsKey(latitude, longitude);
    const cached = locationCache.get(key);
    if (cached) {
      setLabel(cached);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          { cache: "force-cache" },
        );

        if (!res.ok) {
          if (!cancelled) setLabel(coordsLabel);
          return;
        }

        const data = (await res.json()) as ReverseGeoResponse;
        const resolved = pickBestLabel(data) ?? coordsLabel;
        locationCache.set(key, resolved);
        if (!cancelled) setLabel(resolved);
      } catch {
        if (!cancelled) setLabel(coordsLabel);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [coordsLabel, hasCoords, latitude, longitude]);

  return <>{label}</>;
}
