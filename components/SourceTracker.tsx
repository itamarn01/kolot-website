"use client";

import { useEffect } from "react";
import { captureSource } from "@/lib/source";

/** Remembers where the visitor came from (?src=ig, utm_source, or the referring site) for the lead forms. */
export default function SourceTracker() {
  useEffect(() => captureSource(), []);
  return null;
}
