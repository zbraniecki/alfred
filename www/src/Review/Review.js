import React from 'react';

import { createUpdate, Previous, Reviewed } from './Update';

const dtf = Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export default function Review(props) {
  return (
    <div>

      <header>
        <div className="logo"></div>
        <h1>{props.author} · {dtf.format(props.reportDate)}</h1>
      </header>

      <div className="content flex">

        <div className="previous">
          <section>
            <h2># Inbox</h2>

            <ul>
              {props.inbox.map(update => createUpdate(Previous, props, update))}
            </ul>
          </section>

          <section>
            <h2># Previous Todo</h2>
            <ul>
              {props.prevtodo.map(update => createUpdate(Previous, props, update))}
            </ul>
          </section>
        </div>

        <div className="next">
          <section>
            <h2># Goals for this week</h2>
            <ul>
              {props.todo.map(update => createUpdate(Reviewed, props, update))}
            </ul>
          </section>

          <section>
            <h2># Struggles last week</h2>
            <ul>
              {props.struggle.map(update => createUpdate(Reviewed, props, update))}
            </ul>
          </section>

          <section>
            <h2># Achievements last week</h2>
            <ul>
              {props.done.map(update => createUpdate(Reviewed, props, update))}
            </ul>
          </section>

        </div>

      </div>
    </div>
  );
}
