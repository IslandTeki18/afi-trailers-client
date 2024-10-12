import * as React from "react";
import { footerNavItems } from "~src/utils";

export const SimpleFooter = () => {
  return (
    <footer className="bg-gray-800 ">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          aria-label="Footer"
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
        >
          {footerNavItems.main.map((item) => (
            <div key={item.name} className="pb-6">
              <a
                href={item.href}
                className="text-sm leading-6 text-gray-200 hover:text-gray-900"
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {footerNavItems.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-200 hover:text-gray-500"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="h-6 w-6" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-gray-300">
          &copy; 2023 AFI Rental Trailers, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
