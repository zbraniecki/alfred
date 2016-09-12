import React from 'react';

import { createUpdate, Previous, Reviewed } from './Update';

import { reportName } from '../utils';

function Inbox(props) {
  if (props.inbox.length === 0) {
    return (
      <section>
        <h2># Inbox</h2>
        <div className="support">
          (Have a wonderful day!)
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2># Inbox</h2>
      <ul>
        {props.inbox.map(update => createUpdate(Previous, props, update))}
      </ul>
    </section>
  );
}

export default function Review(props) {
  return (
    <div>

      <header>
        <div className="logo"></div>
        <h1>{props.author}</h1>
      </header>

      <div className="content flex">

        <div className="previous">
          <Inbox {...props}/>

          <section>
            <h2># Previous Todo</h2>
            <ul>
              {props.prevtodo.map(update => createUpdate(Previous, props, update))}
            </ul>
          </section>
        </div>

        <div className="next">
          <h2># Report for {reportName(props.reportDate)}</h2>
          <section>
            <h3>Goals for this week</h3>
            <ul>
              {props.todo.map(update => createUpdate(Reviewed, props, update))}
            </ul>
          </section>

          <section>
            <h3>Struggles last week</h3>
            <ul>
              {props.struggle.map(update => createUpdate(Reviewed, props, update))}
            </ul>
          </section>

          <section>
            <h3>Achievements last week</h3>
            <ul>
              {props.done.map(update => createUpdate(Reviewed, props, update))}
            </ul>
          </section>

        </div>

      </div>
    </div>
  );
}
