import React from 'react';
import { Link } from 'react-router';

import {
  UpdateList, createUpdate, Incoming, CurrentGoal, Todo, Done, Reviewed
} from './Update';
import WikiTextLink from '../report/WikiTextLink';
import HeaderContainer from '../header/HeaderContainer';

import { reportName } from '../../utils';
import { genericMessages } from '../../messages';

export default function Inbox(props) {
  return (
    <div>

      <HeaderContainer
        author={props.author}
      />

      <div className="content">

        <div className="content__column">
          <UpdateList
            {...props}
            className="tile"
            quips={genericMessages}
            item={Incoming}
            name="Inbox"
          >
            {props.inbox}
          </UpdateList>

          <UpdateList
            {...props}
            className="tile"
            quips={genericMessages}
            item={Incoming}
            name="Recent activity"
          >
            {props.events}
          </UpdateList>
        </div>

        <div className="content__column">
          <UpdateList
            {...props}
            className="tile tile--scratchpad"
            quips={genericMessages}
            item={CurrentGoal}
            name="Your current goals"
          >
            {props.prevgoals}
          </UpdateList>

          <UpdateList
            {...props}
            className="tile tile--scratchpad"
            quips={genericMessages}
            item={Todo}
            name="To do"
          >
            {props.todo}
          </UpdateList>

          <UpdateList
            {...props}
            className="tile tile--scratchpad"
            quips={genericMessages}
            item={Done}
            name="Done"
          >
            {props.done}
          </UpdateList>
        </div>

        <div className="content__column">
          <section className="tile tile--report">
            <h2 className="tile__title tile__title--report">
              Report for {reportName(props.nextReportDate)}
              <div className="tile__actions">
                <Link className="action" to={`/report/${props.nextReportSlug}`}>see full report</Link>
                <WikiTextLink {...props} className="action">wikify</WikiTextLink>
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
    </div>
  );
}
