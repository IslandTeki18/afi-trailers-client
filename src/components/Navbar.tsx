import * as React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, Link } from "react-router-dom";
import { business } from "~src/data/business";
import { primaryBookingPath } from "~src/data/trailers";
import { buttonClasses } from "./Button";
import { classNames } from "~src/utils/helperFunctions";
// @ts-ignore
import logo from "url:~src/assets/icons/AFI-TRAILER-LOGO.png";

export type NavItem = { name: string; href: string };

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  classNames("nav-link", isActive ? "text-amber" : "text-bone hover:text-amber");

export const Navbar: React.FC<{ navigation: NavItem[] }> = ({ navigation }) => (
  <div className="bg-ink">
    {/* utility bar */}
    <div className="border-b border-ink-rule">
      <div className="mx-auto max-w-site px-5 sm:px-10 h-9 flex items-center justify-between text-[12px] font-medium uppercase tracking-[0.16em] text-mute-3">
        <span className="truncate">
          {business.city}
          <span className="hidden sm:inline"> · {business.serviceArea}</span>
        </span>
        <span className="flex items-center gap-6">
          <span className="hidden md:inline">{business.hours}</span>
          <a href={business.phoneHref} className="font-semibold text-amber">
            {business.phoneDisplay}
          </a>
        </span>
      </div>
    </div>

    <Disclosure as="header">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-site px-5 sm:px-10 h-[76px] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="" className="w-[38px] h-[38px]" />
              <span className="flex flex-col gap-0.5">
                <span className="font-display font-bold text-[22px] leading-none uppercase tracking-[0.06em] text-bone">
                  {business.name}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-mute-4">
                  {business.tagline}
                </span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <NavLink key={item.href} to={item.href} className={linkClasses}>
                  {item.name}
                </NavLink>
              ))}
              <Link
                to={primaryBookingPath}
                className={buttonClasses("amber", "small")}
              >
                Check dates
              </Link>
              <SignedOut>
                <SignInButton mode="modal">
                  <button type="button" className={buttonClasses("outline-light", "small")}>
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>

            <DisclosureButton className="lg:hidden p-2 text-bone hover:text-amber focus:outline-none">
              <span className="sr-only">Toggle menu</span>
              {open ? (
                <XMarkIcon className="h-7 w-7" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-7 w-7" aria-hidden="true" />
              )}
            </DisclosureButton>
          </div>

          <DisclosurePanel className="lg:hidden border-t border-ink-rule">
            <div className="mx-auto max-w-site px-5 sm:px-10 py-4 flex flex-col gap-1">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.href}
                  as={NavLink}
                  to={item.href}
                  className={({ isActive }: { isActive: boolean }) =>
                    classNames("block py-3", linkClasses({ isActive }))
                  }
                >
                  {item.name}
                </DisclosureButton>
              ))}
              <DisclosureButton
                as={Link}
                to={primaryBookingPath}
                className={buttonClasses("amber", "medium", "mt-3")}
              >
                Check dates
              </DisclosureButton>
              <SignedOut>
                <SignInButton mode="modal">
                  <button type="button" className={buttonClasses("outline-light", "medium", "mt-2")}>
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="mt-3">
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  </div>
);
