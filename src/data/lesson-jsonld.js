/* JSON-LD des leçons : HowTo, FAQPage et BreadcrumbList.
   Les entrées doivent refléter exactement le texte visible de la page. */
const ORIGIN = 'https://hydraetl.com';

export function lessonJsonLd({ path, name, steps = [], faq = [], crumbs = [] }) {
  const url = ORIGIN + path;
  const graph = [];
  if (steps.length) {
    graph.push({
      '@type': 'HowTo', '@id': `${url}#howto`, name, inLanguage: 'en',
      step: steps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, name: text, text })),
    });
  }
  if (faq.length) {
    graph.push({
      '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: 'en',
      mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  if (crumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`,
      itemListElement: crumbs.map(([label, href], i) => ({
        '@type': 'ListItem', position: i + 1, name: label, item: ORIGIN + href,
      })),
    });
  }
  return graph;
}
