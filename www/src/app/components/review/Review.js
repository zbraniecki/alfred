import React from 'react';
import { Link } from 'react-router';

import { UpdateList, createUpdate, Done, Reviewed } from '../inbox/Update';
import { Previous } from './Update';
import { WikiTextLink } from '../report/WikiTextLink';

import { reportName } from '../../utils';
import { genericMessages } from '../../messages';

export default function Review(props) {
  return (
    <div>

      <header className="header">
        <div className="logo logo--orange"></div>
        <h1 className="header__title">{props.author}, review your weekly report</h1>
      </header>

      <div className="content">

        <div className="content__column">
          <UpdateList
            {...props}
            quips={genericMessages}
            item={Previous}
            name="Inbox"
          >
            {props.inbox}
          </UpdateList>

          <UpdateList
            {...props}
            quips={genericMessages}
            item={Previous}
            name="Your goals from previous reports"
          >
            {props.prevgoals}
          </UpdateList>
        </div>

        <div className="content__column">
          <UpdateList
            {...props}
            quips={genericMessages}
            item={Done}
            name="Already done"
          >
            {props.done}
          </UpdateList>
        </div>

        <div className="content__column">
          <section className="tile tile--report">
            <h2 className="tile__title tile__title--report">
              Report for {reportName(props.reportDate)}
              <div className="tile__actions">
                <Link className="action" to={`/report/${props.report}`}>see full report</Link>
                <WikiTextLink {...props} className="action">wikify</WikiTextLink>
              </div>
            </h2>
            <h3 className="tile__subtitle">
              Goals for this week
              <div className="tile__actions">
                <button className="action" onClick={() => props.handleStartAdd('goal')}>add</button>
              </div>
            </h3>
            <ul className="tile__updates">
              {props.goals.map(update => createUpdate(Reviewed, props, update))}
            </ul>

            <h3 className="tile__subtitle">
              Struggles last week
              <div className="tile__actions">
                <button className="action" onClick={() => props.handleStartAdd('struggle')}>add</button>
              </div>
            </h3>
            <ul className="tile__updates">
              {props.struggles.map(update => createUpdate(Reviewed, props, update))}
            </ul>

            <h3 className="tile__subtitle">
              Achievements last week
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
    </div>
  );
}
