import React from 'react';

const dtf = Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

function PreviousUpdate(props) {
  return (
    <li>
      <span>{props.children}</span>
      <div className="toolbar">
        <button onClick={() => props.handleResolve('done')}>done</button>
        <button onClick={() => props.handleResolve('todo')}>todo</button>
        <button onClick={() => props.handleResolve('struggle')}>struggle</button>
      </div>
    </li>
  );
}

function ReviewedUpdate(props) {
  return (
    <li>
      <span>{props.children}</span>
    </li>
  );
}


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
              {Array.from(props.inbox).map(update =>
                <PreviousUpdate
                  key={update.createdAt}
                  handleResolve={status => props.handleResolve(update, status, props.reportDate)}
                >{update.text}</PreviousUpdate>
              )}
            </ul>
          </section>

          <section>
            <h2># Previous Todo</h2>
            <ul>
              {Array.from(props.prevtodo).map(update =>
                <PreviousUpdate
                  key={update.createdAt}
                  handleResolve={status => props.handleResolve(update, status, props.reportDate)}
                >{update.text}</PreviousUpdate>
              )}
            </ul>
          </section>
        </div>

        <div className="next">
          <section>
            <h2># Done last week</h2>
            <ul>
              {Array.from(props.done).map(update =>
                <ReviewedUpdate
                  key={update.createdAt}
                  handleResolve={status => props.handleResolve(update, status, props.reportDate)}
                >{update.text}</ReviewedUpdate>
              )}
            </ul>
          </section>

          <section>
            <h2># Todo this week</h2>
            <ul>
              {Array.from(props.todo).map(update =>
                <ReviewedUpdate
                  key={update.createdAt}
                  handleResolve={status => props.handleResolve(update, status, props.reportDate)}
                >{update.text}</ReviewedUpdate>
              )}
            </ul>
          </section>

          <section>
            <h2># Struggles last week</h2>
            <ul>
              {Array.from(props.struggle).map(update =>
                <ReviewedUpdate
                  key={update.createdAt}
                  handleResolve={status => props.handleResolve(update, status, props.reportDate)}
                >{update.text}</ReviewedUpdate>
              )}
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
}
