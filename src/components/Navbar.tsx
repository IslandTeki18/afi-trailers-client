import * as React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, FireIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
// @ts-ignore
import lightCircleLogo from "url:~src/assets/icons/AFI-TRAILER-LOGO.png";

type NavItem = {
  name: string;
  href: string;
  current: boolean;
};

type NavbarProps = {
  navigation: NavItem[];
  logoSrc?: string;
  variant?: "primary" | "secondary" | "accent" | "neutral";
};

const variantClasses = {
  primary: {
    base: "bg-gray-900",
    text: "text-white",
    hover: "hover:bg-gray-700",
    active: "bg-gray-800",
  },
  secondary: {
    base: "bg-yellow-800",
    text: "text-white",
    hover: "hover:bg-yellow-700",
    active: "bg-yellow-900",
  },
  accent: {
    base: "bg-red-600",
    text: "text-white",
    hover: "hover:bg-red-700",
    active: "bg-red-800",
  },
  neutral: {
    base: "bg-gray-600",
    text: "text-white",
    hover: "hover:bg-gray-700",
    active: "bg-gray-800",
  },
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar: React.FC<NavbarProps> = ({
  navigation,
  logoSrc,
  variant = "primary",
}) => {
  const variantStyle = variantClasses[variant];

  return (
    <Disclosure as="nav" className={`${variantStyle.base} w-full`}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton
                  className={`group relative inline-flex items-center justify-center rounded-md p-2 ${variantStyle.text} ${variantStyle.hover} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  {logoSrc ? (
                    <img
                      className="h-8 w-auto"
                      src={logoSrc}
                      alt="Your Company"
                    />
                  ) : (
                    <img src={lightCircleLogo} alt="" className="w-10 h-10" />
                  )}
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex items-end- space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? variantStyle.active
                            : variantStyle.hover,
                          variantStyle.text,
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? variantStyle.active : variantStyle.hover,
                    variantStyle.text,
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};
