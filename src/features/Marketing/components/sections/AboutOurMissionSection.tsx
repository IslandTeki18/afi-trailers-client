import * as React from "react";
import { SectionWrapper } from "~src/components";

const stats = [
  { label: "of junk/garbage removed", value: "15+ tonnes" },
  { label: "customers served", value: "10+" },
  { label: "sod and other material delivered", value: "3 acres" },
];

type AboutOurMissionSectionProps = {};

export const AboutOurMissionSection = (props: AboutOurMissionSectionProps) => {
  return (
    <SectionWrapper paddingY="small">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Our mission
      </h2>
      <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
        <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
          <p className="text-xl leading-8 text-gray-600">
            Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At
            arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at vitae
            feugiat egestas ac. Diam nulla orci at in viverra scelerisque eget.
            Eleifend egestas fringilla sapien.
          </p>
          <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
            <p>
              Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus
              enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor
              praesent donec est. Odio penatibus risus viverra tellus varius sit
              neque erat velit. Faucibus commodo massa rhoncus, volutpat.
              Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae
              sed turpis id.
            </p>
            <p className="mt-10">
              Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis
              odio id et. Id blandit molestie auctor fermentum dignissim. Lacus
              diam tincidunt ac cursus in vel. Mauris varius vulputate et
              ultrices hac adipiscing egestas. Iaculis convallis ac tempor et
              ut. Ac lorem vel integer orci.
            </p>
          </div>
        </div>
        <div className="lg:flex lg:flex-auto lg:justify-center">
          <dl className="w-64 space-y-8 xl:w-80">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-y-4">
                <dt className="text-base leading-7 text-gray-600">
                  {stat.label}
                </dt>
                <dd className="text-5xl font-semibold tracking-tight text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </SectionWrapper>
  );
};
