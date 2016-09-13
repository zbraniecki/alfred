import React from 'react';

import { createUpdate, Previous, Reviewed } from './Update';

import { reportName } from '../utils';

function Inbox(props) {
  const content = props.inbox.length === 0 ?
    <div className="support">(Have a wonderful day!)</div> :
    <ul>{props.inbox.map(up => createUpdate(Previous, props, up))}</ul>

  return (
    <section>
      <h2>Inbox</h2>
      {content}
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
            <h2>Your goals from last week</h2>
            <ul>
              {props.prevtodo.map(update => createUpdate(Previous, props, update))}
            </ul>
          </section>
        </div>

        <div className="next">
          <section className="user-report">
            <h2>Report for {reportName(props.reportDate)}</h2>
            <h3>
              Goals for this week
              <button onClick={() => props.handleStartAdd('todo')}>add</button>
            </h3>
            <ul>
              {props.todo.map(update => createUpdate(Reviewed, props, update))}
            </ul>

            <h3>
              Struggles last week
              <button onClick={() => props.handleStartAdd('struggle')}>add</button>
            </h3>
            <ul>
              {props.struggle.map(update => createUpdate(Reviewed, props, update))}
            </ul>

            <h3>
              Achievements last week
              <button onClick={() => props.handleStartAdd('done')}>add</button>
            </h3>
            <ul>
              {props.done.map(update => createUpdate(Reviewed, props, update))}
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
}
