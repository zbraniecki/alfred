import React from 'react';

function UntriagedUpdate(props) {
  return (
    <li>
      <span>{props.children}</span>
      <div className="toolbar">
        <button onClick={() => props.handleTriage('done')}>done</button>
        <button onClick={() => props.handleTriage('todo')}>todo</button>
        <button className="danger" onClick={props.handleRemove}>x</button>
      </div>
    </li>
  );
}

function TriagedUpdate(props) {
  return (
    <div>
      {props.children}
    </div>
  );
}


export default function Review(props) {
  return (
    <div>

      <header>
        <div className="logo"></div>
        <h1>{props.author} · {props.reportDate.toDateString()}</h1>
      </header>

      <div className="content flex">

        <div className="previous">
          <section>
            <h2># Inbox</h2>

            <ul>
              {Array.from(props.inbox).map(update =>
                <UntriagedUpdate
                  key={update.createdAt}
                  handleTriage={status => props.handleTriage(update, status, props.reportDate)}
                >{update.text}</UntriagedUpdate>
              )}
            </ul>
          </section>

          <section>
            <h2># Previous Todo</h2>
            <ul>
              {Array.from(props.prevtodo).map(update =>
                <UntriagedUpdate
                  key={update.createdAt}
                  handleTriage={status => props.handleTriage(update, status, props.reportDate)}
                >{update.text}</UntriagedUpdate>
              )}
            </ul>
          </section>
        </div>

        <div className="next">
          <section>
            <h2># Done</h2>
            <ul>
              {Array.from(props.done).map(update =>
                <TriagedUpdate
                  key={update.createdAt}
                  handleTriage={status => props.handleTriage(update, status, props.reportDate)}
                >{update.text}</TriagedUpdate>
              )}
            </ul>
          </section>

          <section>
            <h2># Todo</h2>
            <ul>
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
}
