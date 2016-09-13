import React from 'react';

import { createUpdate, Previous, Reviewed } from './Update';

import { reportName } from '../utils';

function Inbox(props) {
  const content = props.inbox.length === 0 ?
    <div className="suggestions__tip">(Have a wonderful day!)</div> :
    <ul className="report__list">
      {props.inbox.map(up => createUpdate(Previous, props, up))}
    </ul>

  return (
    <section className="suggestions">
      <h2 className="suggestions__title">Inbox</h2>
      {content}
    </section>
  );
}

export default function Review(props) {
  return (
    <div>

      <header className="header">
        <div className="logo"></div>
        <h1 className="header__title">{props.author}</h1>
      </header>

      <div className="content">

        <div className="content__tile">
          <Inbox {...props}/>

          <section className="suggestions">
            <h2 className="suggestions__title">Your goals from last week</h2>
            <ul className="report__list">
              {props.prevtodo.map(update => createUpdate(Previous, props, update))}
            </ul>
          </section>
        </div>

        <div className="content__tile">
          <section className="report">
            <h2 className="report__title">Report for {reportName(props.reportDate)}</h2>
            <h3 className="report__subtitle">
              Goals for this week
              <div className="report__actions report__actions--inline">
                <button className="report__action" onClick={() => props.handleStartAdd('todo')}>add</button>
              </div>
            </h3>
            <ul className="report__list">
              {props.todo.map(update => createUpdate(Reviewed, props, update))}
            </ul>

            <h3 className="report__subtitle">
              Struggles last week
              <div className="report__actions report__actions--inline">
                <button className="report__action" onClick={() => props.handleStartAdd('struggle')}>add</button>
              </div>
            </h3>
            <ul className="report__list">
              {props.struggle.map(update => createUpdate(Reviewed, props, update))}
            </ul>

            <h3 className="report__subtitle">
              Achievements last week
              <div className="report__actions report__actions--inline">
                <button className="report__action" onClick={() => props.handleStartAdd('done')}>add</button>
              </div>
            </h3>
            <ul className="report__list">
              {props.done.map(update => createUpdate(Reviewed, props, update))}
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
}
