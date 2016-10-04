import React from 'react';
import { Link } from 'react-router';

import WikiTextLink from './WikiTextLink';

function Update(props) {
  return (
    <li className="update">
      <span>{props.children}</span>
    </li>
  );
}

export default function UserReport(props) {
  return (
    <div className="content__tile">
      <section className="tile tile--report">
        <h2 className="tile__title tile__title--report">
          {props.author}
          <div className="tile__actions">
            <Link className="action" to={`/inbox/${props.author}`}>inbox</Link>
            <WikiTextLink {...props} className="action">wikify</WikiTextLink>
          </div>
        </h2>

        <h3 className="tile__subtitle">Goals for this week</h3>
        <ul className="tile__updates">
          {props.goals.map(up => <Update key={up._id}>{up.text}</Update>)}
        </ul>

        <h3 className="tile__subtitle">Struggles last week</h3>
        <ul className="tile__updates">
          {props.struggles.map(up => <Update key={up._id}>{up.text}</Update>)}
        </ul>

        <h3 className="tile__subtitle">Achievements last week</h3>
        <ul className="tile__updates">
          {props.achievements.map(up => <Update key={up._id}>{up.text}</Update>)}
        </ul>
      </section>
    </div>
  );
}
