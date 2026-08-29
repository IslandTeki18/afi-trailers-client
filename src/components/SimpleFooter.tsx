import * as React from "react";
import { Link } from "react-router-dom";
import { business } from "~src/data/business";
import { footerColumns } from "~src/utils/footerNavItems";
// @ts-ignore
import logo from "url:~src/assets/icons/AFI-TRAILER-LOGO.png";

export const SimpleFooter = () => (
  <footer className="bg-ink mt-auto">
    <div className="mx-auto max-w-site px-5 sm:px-10 pt-16 pb-7">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] pb-11 border-b border-ink-rule">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="w-[34px] h-[34px]" />
            <span className="font-display font-bold text-[22px] leading-none uppercase tracking-[0.06em] text-bone">
              {business.name}
            </span>
          </div>
          <p className="max-w-[300px] text-[15px] leading-relaxed text-mute-4">
            Dump trailer rentals in south Utah County. Owner-operated out of
            Spanish Fork.
          </p>
        </div>
        {footerColumns.map((column) => (
          <div key={column.heading} className="flex flex-col gap-3.5">
            <span className="font-semibold text-[11px] uppercase tracking-[0.2em] text-amber">
              {column.heading}
            </span>
            {column.links.map((link) =>
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[15px] text-rule-2 hover:text-amber"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-[15px] text-rule-2 hover:text-amber"
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between pt-6 text-xs text-mute">
        <span>
          &copy; {new Date().getFullYear()} {business.legalName} All rights
          reserved.
        </span>
        <span>
          {business.city} · {business.phoneDisplay}
        </span>
      </div>
    </div>
  </footer>
);
