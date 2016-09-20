import React from 'react';

function wikiList(updates) {
  return updates.map(up => '* ' + up.text).join('\n') || '*';
}

export function WikiTextLink(props) {
  const {
    author, goals, struggles, achievements, children, className
  } = props;
  const content = `===${author}===
Goals for this week:
${wikiList(goals)}

Struggles last week:
${wikiList(struggles)}

Achievements last week:
${wikiList(achievements)}`;

  const href=`data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;

  return (
    <a target="_blank" href={href} className={className}>{children}</a>
  );
}
