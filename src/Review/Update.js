import React from 'react';

export function Previous(props) {
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

export function Reviewed(props) {
  return (
    <li>
      <span>{props.children}</span>
    </li>
  );
}

export function createUpdate(Update, props, update) {
  return (
    <Update
      key={update.createdAt}
      handleResolve={status => props.handleResolve(update, status, props.reportDate)}
    >
      {update.text}
    </Update>
  );
}

