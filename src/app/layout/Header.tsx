import * as React from "react";
import { useState } from "react";

type Link = {
  name: string;
  href: string;
};

type HeaderProps = {
  variant: "primary" | "secondary" | "accent" | "neutral";
  companyName: string;
  logo?: string;
  links: Link[];
  loginText?: string;
};

export const Header: React.FC<HeaderProps> = ({
  variant,
  companyName,
  logo,
  links,
  loginText = "Log in",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseClasses = "transition-colors";
  const variantClasses = {
    primary: "bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-50",
    secondary: "bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50",
    accent:
      "bg-indigo-50 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-50",
    neutral: "bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50",
  };

  const linkClasses = "text-sm font-semibold leading-6";
  const mobileLinkClasses =
    "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-gray-800";

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className={`${baseClasses} ${variantClasses[variant]}`}>
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">{companyName}</span>
            {logo && (
              <img className="h-8 w-auto" src={logo} alt={companyName} />
            )}
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {links.map((link) => (
            <a key={link.name} href={link.href} className={linkClasses}>
              {link.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className={linkClasses}>
            {loginText} <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      {/* Mobile menu */}
      <div
        className={`lg:hidden ${isMobileMenuOpen ? "" : "hidden"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 z-10"></div>
        <div
          className={`fixed inset-y-0 right-0 z-10 w-full overflow-y-auto ${variantClasses[variant]} px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10`}
        >
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">{companyName}</span>
              <img className="h-8 w-auto" src={logo} alt={companyName} />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={mobileLinkClasses}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a href="#" className={mobileLinkClasses}>
                  {loginText}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
