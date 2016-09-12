import React from 'react';

function Update(props) {
  return (
    <li>
      <span>{props.children}</span>
    </li>
  );
}

export default function UserReport(props) {
  return (
    <section>
      <h2># {props.author}</h2>

      <h3>Goals for this week</h3>
      <ul>
        {props.todo.map(up => <Update key={up._id}>{up.text}</Update>)}
      </ul>

      <h3>Struggles last week</h3>
      <ul>
        {props.struggle.map(up => <Update key={up._id}>{up.text}</Update>)}
      </ul>

      <h3>Achievements last week</h3>
      <ul>
        {props.done.map(up => <Update key={up._id}>{up.text}</Update>)}
      </ul>
    </section>
  );
}
