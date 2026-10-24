import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../shared/ui/accordion';
import { FAQ } from './content';

/** 자주 묻는 것 — 첫 항목만 펼친 채 시작 */
export const FaqSection = () => (
  <section className="px-4 pb-20 sm:px-6 md:pb-30">
    <div className="mx-auto grid max-w-[1120px] gap-8 md:grid-cols-[1fr_2fr] md:gap-12">
      <h2 className="text-[26px] leading-snug font-extrabold tracking-tight md:text-4xl">자주 묻는 것</h2>
      <Accordion type="single" collapsible defaultValue={FAQ[0]?.id} className="border-t border-border">
        {FAQ.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent className="leading-relaxed [overflow-wrap:anywhere]">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
