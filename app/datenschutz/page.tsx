/* LEGAL REVIEW PENDING (not launch-ready): HRB-Nr blank (fill the real
   Handelsregisternummer); USt-ID blank (fill if it exists, else remove the
   line); confirm registered address + that T.m@trinity-pharma.de is monitored;
   Datenschutz §4 rewritten to necessary-cookies-only to match the no-banner
   reality — re-add analytics + a consent banner only if analytics are actually
   used. Recommend eRecht24/lawyer-generated final text. */

import type { Metadata } from "next";
import DatenschutzView from "@/components/legal/DatenschutzView";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung der Trinity Pharma GmbH gemäß DSGVO.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return <DatenschutzView />;
}
