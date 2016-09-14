import React from 'react';

import { createUpdate, Previous, Done } from './Update';

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
        <div className="logo logo--blue"></div>
        <h1 className="header__title">{props.author}, here's your inbox</h1>
      </header>

      <div className="content">

        <div className="content__tile">
          <Inbox {...props}/>

          <section className="suggestions">
            <h2 className="suggestions__title">Your goals from previous reports</h2>
            <ul className="report__list">
              {props.prevgoals.map(update => createUpdate(Previous, props, update))}
            </ul>
          </section>
        </div>

        <div className="content__tile">
          <section className="suggestions">
            <h2 className="suggestions__title">Already done</h2>
            <ul className="report__list">
              {props.done.map(update => createUpdate(Done, props, update))}
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
}
