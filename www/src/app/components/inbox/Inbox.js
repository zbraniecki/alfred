import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import {
  UpdateList, createUpdate, Incoming, CurrentGoal, Todo, Done, Reviewed
} from './Update';
import WikiTextLink from '../report/WikiTextLink';
import HeaderContainer from '../header/HeaderContainer';

import { reportName } from '../../utils';
import { genericMessages } from '../../messages';

class Inbox extends Component {

  render() {
    const { author, nextReportDate, nextReportSlug } = this.props;
    return (
      <div>

        <HeaderContainer
          author={author}
        />

        <div className="content">

          <div className="content__column">
            <UpdateList
              {...this.props}
              className="tile"
              quips={genericMessages}
              item={Incoming}
              name="Inbox"
            >
              {this.props.inbox}
            </UpdateList>

            <UpdateList
              {...this.props}
              className="tile"
              quips={genericMessages}
              item={Incoming}
              name="Recent activity"
            >
              {this.props.events}
            </UpdateList>
          </div>

          <div className="content__column">
            <UpdateList
              {...this.props}
              className="tile tile--scratchpad"
              quips={genericMessages}
              item={CurrentGoal}
              name="Your current goals"
            >
              {this.props.prevgoals}
            </UpdateList>

            <UpdateList
              {...this.props}
              className="tile tile--scratchpad"
              quips={genericMessages}
              item={Todo}
              name="To do"
            >
              {this.props.todo}
            </UpdateList>

            <UpdateList
              {...this.props}
              className="tile tile--scratchpad"
              quips={genericMessages}
              item={Done}
              name="Done"
            >
              {this.props.done}
            </UpdateList>
          </div>

          <div className="content__column">
            <section className="tile tile--report">
              <h2 className="tile__title tile__title--report">
                Report for {reportName(nextReportDate)}
                <div className="tile__actions">
                  <Link className="action" to={`/report/${nextReportSlug}`}>see full report</Link>
                  <WikiTextLink {...this.props} className="action">wikify</WikiTextLink>
                </div>
              </h2>
              <p className="tile__hint">Prepare the report for the next weekly meeting.</p>
              <h3 className="tile__subtitle">
                Goals for next week
                <div className="tile__actions">
                  <button className="action" onClick={() => this.props.handleStartAdd('goal')}>add</button>
                </div>
              </h3>
              <ul className="tile__updates">
                {this.props.goals.map(update => createUpdate(Reviewed, this.props, update))}
              </ul>

              <h3 className="tile__subtitle">
                Struggles this week
                <div className="tile__actions">
                  <button className="action" onClick={() => this.props.handleStartAdd('struggle')}>add</button>
                </div>
              </h3>
              <ul className="tile__updates">
                {this.props.struggles.map(update => createUpdate(Reviewed, this.props, update))}
              </ul>

              <h3 className="tile__subtitle">
                Achievements this week
                <div className="tile__actions">
                  <button className="action" onClick={() => this.props.handleStartAdd('achievement')}>add</button>
                </div>
              </h3>
              <ul className="tile__updates">
                {this.props.achievements.map(update => createUpdate(Reviewed, this.props, update))}
              </ul>
            </section>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  author: state.inbox.author,
  nextReportDate: state.inbox.nextReportDate,
  nextReportSlug: state.inbox.nextReportSlug
});


export default connect(mapStateToProps)(Inbox);

