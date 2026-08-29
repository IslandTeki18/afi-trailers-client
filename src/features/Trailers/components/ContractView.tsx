import * as React from "react";
import { Header, SectionWrapper } from "~src/components";
import { ContractSection } from "../types/contract";

type ContractViewProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: ContractSection[];
};

export const ContractView = ({ eyebrow, title, description, sections }: ContractViewProps) => (
  <>
    <Header subTitle={eyebrow} title={title} description={description} />
    <SectionWrapper>
      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <div key={section.title} className="border-t-2 border-ink pt-5 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="flex flex-col gap-4">
              <h2 className="display text-[30px] text-ink">{section.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {section.formalText.map((text) => (
                  <li key={text} className="flex gap-2.5 text-[15px] leading-relaxed text-body">
                    <span className="text-amber-mid">—</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-paper border border-rule p-6 h-fit flex flex-col gap-2">
              <span className="label-caps">In plain terms</span>
              <p className="text-[15px] leading-relaxed text-body-2">{section.simpleExplanation}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  </>
);
