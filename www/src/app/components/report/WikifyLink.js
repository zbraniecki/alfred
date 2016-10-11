import React from 'react';

function list(updates) {
  return updates.map(up => '* ' + up.text).join('\n') || '*';
}

function section(author, updates) {
  const goals = updates.filter(up => up.status === 'goal');
  const struggles = updates.filter(up => up.status === 'struggle');
  const achievements = updates.filter(up => up.status === 'achievement');

  return `===${author}===
Goals for this week:
${list(goals)}

Struggles last week:
${list(struggles)}

Achievements last week:
${list(achievements)}`;
}

export default function WikifyLink(props) {
  const { children, className, updatesByAuthor } = props;
  const sections = Array.from(updatesByAuthor).map(
    updatesOfAuthor => section(...updatesOfAuthor)
  );
  const content = sections.join('\n\n');
  const href=`data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;

  return (
    <a target="_blank" href={href} className={className}>{children}</a>
  );
}
