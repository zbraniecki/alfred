import React from 'react';
import { Link } from 'react-router';

function Update(props) {
  return (
    <li className="update">
      <span>{props.children}</span>
    </li>
  );
}

export default function UserReport(props) {
  return (
    <section className="report content__tile">
      <h2 className="report__title">
        {props.author}
        <div className="report__actions">
          <Link className="report__action" to={`/review/${props.author}/${props.report}`}>review</Link>
        </div>
      </h2>

      <h3 className="report__subtitle">Goals for this week</h3>
      <ul className="report__list">
        {props.goals.map(up => <Update key={up._id}>{up.text}</Update>)}
      </ul>

      <h3 className="report__subtitle">Struggles last week</h3>
      <ul className="report__list">
        {props.struggles.map(up => <Update key={up._id}>{up.text}</Update>)}
      </ul>

      <h3 className="report__subtitle">Achievements last week</h3>
      <ul className="report__list">
        {props.achievements.map(up => <Update key={up._id}>{up.text}</Update>)}
      </ul>
    </section>
  );
}
