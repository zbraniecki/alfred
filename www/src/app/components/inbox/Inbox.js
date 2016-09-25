import React from 'react';
import { Link } from 'react-router';

import {
  UpdateList, createUpdate, Incoming, Todo, Done, Reviewed
} from './Update';
import { WikiTextLink } from '../report/WikiTextLink';

import { randElem, reportName } from '../../utils';
import { genericMessages, headerMessages } from '../../messages';

export default function Review(props) {
  return (
    <div>

      <header className="header">
        <div className="logo logo--blue"></div>
        <h1 className="header__title">
          {`${randElem(headerMessages)}, ${props.author}`}
        </h1>
      </header>

      <div className="content">

        <div className="content__tile">
          <UpdateList
            {...props}
            quips={genericMessages}
            item={Incoming}
            name="Your goals from previous reports"
          >
            {props.prevgoals}
          </UpdateList>

          <UpdateList
            {...props}
            quips={genericMessages}
            item={Incoming}
            name="Your activity"
          >
            {props.inbox}
          </UpdateList>
        </div>

        <div className="content__tile">
          <UpdateList
            {...props}
            quips={genericMessages}
            item={Todo}
            name="To do this week"
          >
            {props.todo}
          </UpdateList>

          <UpdateList
            {...props}
            quips={genericMessages}
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
                <WikiTextLink {...props} className="report__action">wikify</WikiTextLink>
              </div>
            </h2>
            <h3 className="report__subtitle">
              Goals for next week
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
