"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";

type Status = "idle" | "loading" | "success" | "error";

interface Fields {
  name: string;
  apotheke: string;
  email: string;
  telefon: string;
  betreff: string;
  nachricht: string;
  company: string; // honeypot
}

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
const MAILTO = "mailto:info@trinity-pharma.de?subject=Anfrage";

export default function KontaktForm({ initialBetreff = "" }: { initialBetreff?: string }) {
  const t = useT();
  const f = t.kontakt.form;
  const [values, setValues] = useState<Fields>({
    name: "",
    apotheke: "",
    email: "",
    telefon: "",
    betreff: initialBetreff,
    nachricht: "",
    company: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const set =
    (k: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = () => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!values.name.trim()) next.name = f.required;
    if (!values.apotheke.trim()) next.apotheke = f.required;
    if (!values.email.trim()) next.email = f.required;
    else if (!isEmail(values.email.trim())) next.email = f.emailInvalid;
    if (!values.betreff.trim()) next.betreff = f.required;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    const vorname = values.name.trim().split(/\s+/)[0] || "";
    const betreff = values.betreff.trim();
    return (
      <div
        className="glass-panel--light"
        role="status"
        aria-live="polite"
        style={{ padding: "2.5rem 2rem", maxWidth: "46ch" }}
      >
        <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontWeight: 300, fontSize: "1.6rem", color: "var(--ink)", margin: 0 }}>
          {f.successTitle(vorname)}
        </p>
        <p style={{ marginTop: "0.75rem", color: "var(--ink-2)", lineHeight: 1.6 }}>
          {f.successBody(betreff)}
        </p>
      </div>
    );
  }

  const field = (
    key: keyof Fields,
    label: string,
    opts: { required?: boolean; type?: string; textarea?: boolean; placeholder?: string; autoComplete?: string } = {}
  ) => {
    const id = `kf-${key}`;
    const err = errors[key];
    const common = {
      id,
      name: key,
      className: "kf-input",
      value: values[key],
      onChange: set(key),
      "aria-invalid": err ? true : undefined,
      "aria-describedby": err ? `${id}-err` : undefined,
      placeholder: opts.placeholder,
    };
    return (
      <div className="kf-field">
        <label className="kf-label" htmlFor={id}>
          {label}
          {opts.required && <span className="kf-req"> *</span>}
        </label>
        {opts.textarea ? (
          <textarea {...common} rows={4} />
        ) : (
          <input
            {...common}
            type={opts.type ?? "text"}
            inputMode={opts.type === "email" ? "email" : undefined}
            autoComplete={opts.autoComplete}
          />
        )}
        {err && (
          <span className="kf-err" id={`${id}-err`}>
            {err}
          </span>
        )}
      </div>
    );
  };

  return (
    <form className="kf-form" onSubmit={onSubmit} noValidate>
      {field("name", f.name, { required: true, placeholder: f.namePh, autoComplete: "name" })}
      {field("apotheke", f.apotheke, { required: true, placeholder: f.apothekePh, autoComplete: "organization" })}
      {field("email", f.email, { required: true, type: "email", placeholder: f.emailPh, autoComplete: "email" })}
      {field("telefon", f.telefon, { placeholder: f.telefonPh, type: "tel", autoComplete: "tel" })}
      {field("betreff", f.betreff, { required: true, placeholder: f.betreffPh })}
      {field("nachricht", f.nachricht, { textarea: true, placeholder: f.nachrichtPh })}

      {/* honeypot — humans never see/fill this */}
      <div className="kf-hp" aria-hidden>
        <label htmlFor="kf-company">Company</label>
        <input id="kf-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
      </div>

      {status === "error" && (
        <p className="kf-err" role="alert" style={{ fontSize: "0.9rem" }}>
          {f.sendError}{" "}
          <a href={MAILTO} style={{ color: "var(--teal)" }}>
            info@trinity-pharma.de
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          alignSelf: "flex-start",
          marginTop: "0.5rem",
          background: "var(--indigo)",
          color: "#FFFFFF",
          padding: "0.9rem 1.8rem",
          borderRadius: 999,
          fontSize: "0.92rem",
          fontWeight: 600,
          border: "none",
          cursor: status === "loading" ? "default" : "pointer",
          opacity: status === "loading" ? 0.7 : 1,
        }}
      >
        {status === "loading" ? f.submitting : f.submit}
      </button>
    </form>
  );
}
