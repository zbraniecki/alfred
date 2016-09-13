import React from 'react';

function Update(props) {
  return (
    <li className="report__item">
      <span>{props.children}</span>
    </li>
  );
}

export default function UserReport(props) {
  return (
    <section className="report content__tile">
      <h2 className="report__title">{props.author}</h2>

      <h3 className="report__subtitle">Goals for this week</h3>
      <ul className="report__list">
        {props.todo.map(up => <Update key={up._id}>{up.text}</Update>)}
      </ul>

      <h3 className="report__subtitle">Struggles last week</h3>
      <ul className="report__list">
        {props.struggle.map(up => <Update key={up._id}>{up.text}</Update>)}
      </ul>

      <h3 className="report__subtitle">Achievements last week</h3>
      <ul className="report__list">
        {props.done.map(up => <Update key={up._id}>{up.text}</Update>)}
      </ul>
    </section>
  );
}
