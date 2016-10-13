import React from 'react';
import { Link } from 'react-router';

import {
  UpdateList, createUpdate, Incoming, CurrentGoal, Todo, Done, Reviewed
} from './Update';

import { reportName } from '../../utils';

export default function Board(props) {
  const prevReportHref = `/report/${props.prevReportSlug}`;
  const prevReportLink = <Link className="action" to={prevReportHref}>view full report</Link>;
  const nextReportHref = `/report/${props.nextReportSlug}`;
  const nextReportLink = <Link className="action" to={nextReportHref}>preview</Link>;

  return (
    <div className="content content--columns">

      <div className="content__column">
        <UpdateList
          {...props}
          className="tile"
          itemComponent={Incoming}
          items={props.inbox}
          name="Inbox"
        />

        <UpdateList
          {...props}
          className="tile"
          itemComponent={Incoming}
          items={props.events}
          name="Recent activity"
        />
      </div>

      <div className="content__column">
        <UpdateList
          {...props}
          className="tile tile--scratchpad"
          itemComponent={CurrentGoal}
          items={props.prevgoals}
          name="Your current goals"
          link={prevReportLink}
        />

        <UpdateList
          {...props}
          className="tile tile--scratchpad"
          itemComponent={Todo}
          items={props.todo}
          name="To do"
        />

        <UpdateList
          {...props}
          className="tile tile--scratchpad"
          itemComponent={Done}
          items={props.done}
          name="Done"
        />
      </div>

      <div className="content__column">
        <section className="tile tile--report">
          <h2 className="tile__title tile__title--report">
            Report for {reportName(props.nextReportDate)}
            <div className="tile__actions">
              {nextReportLink}
            </div>
          </h2>
          <p className="tile__hint">Prepare the report for the next weekly meeting.</p>
          <h3 className="tile__subtitle">
            Goals for next week
            <div className="tile__actions">
              <button className="action" onClick={() => props.handleStartAdd('goal')}>add</button>
            </div>
          </h3>
          <ul className="tile__updates">
            {props.goals.map(update => createUpdate(Reviewed, props, update))}
          </ul>

          <h3 className="tile__subtitle">
            Struggles this week
            <div className="tile__actions">
              <button className="action" onClick={() => props.handleStartAdd('struggle')}>add</button>
            </div>
          </h3>
          <ul className="tile__updates">
            {props.struggles.map(update => createUpdate(Reviewed, props, update))}
          </ul>

          <h3 className="tile__subtitle">
            Achievements this week
            <div className="tile__actions">
              <button className="action" onClick={() => props.handleStartAdd('achievement')}>add</button>
            </div>
          </h3>
          <ul className="tile__updates">
            {props.achievements.map(update => createUpdate(Reviewed, props, update))}
          </ul>
        </section>
      </div>

    </div>
  );
}
