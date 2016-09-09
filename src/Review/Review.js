import React from 'react';

export default function Review(props) {
  return (
    <div>
      <h1>{props.author}</h1>
      {props.updates.map(
        update => <div key={update.createdAt}>{update.text}</div>
      )}
    </div>
  );
}
