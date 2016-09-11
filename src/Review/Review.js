import React from 'react';

import './Review.css';

function UntriagedUpdate(props) {
  return (
    <div>
      {props.children}
      <button onClick={() => props.handleTriage('done')}>done</button>
    </div>
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
      <h1>{props.author} — {props.reportDate.toDateString()}</h1>

      <div className="alf-review">
        <div>
          <h2>Inbox</h2>
          <div>
            {Array.from(props.inbox).map(update =>
              <UntriagedUpdate
                handleTriage={status => props.handleTriage(update, status, props.reportDate)}
                key={update.createdAt}
              >
                {update.text}
              </UntriagedUpdate>
            )}
          </div>
          <h2>Previously Todo</h2>
          <div>
            {Array.from(props.prevtodo).map(update =>
              <UntriagedUpdate
                handleTriage={status => props.handleTriage(update, status, props.reportDate)}
                key={update.createdAt}
              >
                {update.text}
              </UntriagedUpdate>
            )}
          </div>
        </div>

        <div>
          <h2>Done</h2>
          <div>
            {Array.from(props.done).map(update =>
              <TriagedUpdate
                handleTriage={status => props.handleTriage(update, props.reportDate, status)}
                key={update.createdAt}
              >
                {update.text}
              </TriagedUpdate>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
