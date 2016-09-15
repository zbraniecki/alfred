import React from 'react';
import { Link } from 'react-router';

import { UpdateList, createUpdate } from '../inbox/Update';
import { Previous, Done, Reviewed } from './Update';

import { reportName } from '../../utils';
import { emptyInboxQuips, emptyPreviousQuips, emptyDoneQuips }
  from '../../messages';

export default function Review(props) {
  return (
    <div>

      <header className="header">
        <div className="logo logo--orange"></div>
        <h1 className="header__title">{props.author}, review your weekly report</h1>
      </header>

      <div className="content">

        <div className="content__tile">
          <UpdateList
            {...props}
            quips={emptyInboxQuips}
            item={Previous}
            name="Inbox"
          >
            {props.inbox}
          </UpdateList>

          <UpdateList
            {...props}
            quips={emptyPreviousQuips}
            item={Previous}
            name="Your goals from previous reports"
          >
            {props.prevgoals}
          </UpdateList>
        </div>

        <div className="content__tile">
          <UpdateList
            {...props}
            quips={emptyDoneQuips}
            item={Done}
            name="Already done"
          >
            {props.done}
          </UpdateList>
        </div>

        <div className="content__tile">
          <section className="report">
            <h2 className="report__title">
              Report for {reportName(props.reportDate)}
              <div className="report__actions">
                <Link className="report__action" to={`/report/${props.report}`}>see full report</Link>
              </div>
            </h2>
            <h3 className="report__subtitle">
              Goals for this week
              <div className="report__actions">
                <button className="report__action" onClick={() => props.handleStartAdd('goal')}>add</button>
              </div>
            </h3>
            <ul className="report__list">
              {props.goals.map(update => createUpdate(Reviewed, props, update))}
            </ul>

            <h3 className="report__subtitle">
              Struggles last week
              <div className="report__actions">
                <button className="report__action" onClick={() => props.handleStartAdd('struggle')}>add</button>
              </div>
            </h3>
            <ul className="report__list">
              {props.struggles.map(update => createUpdate(Reviewed, props, update))}
            </ul>

            <h3 className="report__subtitle">
              Achievements last week
              <div className="report__actions">
                <button className="report__action" onClick={() => props.handleStartAdd('achievement')}>add</button>
              </div>
            </h3>
            <ul className="report__list">
              {props.achievements.map(update => createUpdate(Reviewed, props, update))}
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
}
