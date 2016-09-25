import React from 'react';

import InboxContainer from './InboxContainer';
import Review from '../components/review/Review';
import { API_URL } from '../../config';
import { makeUpdate, get } from '../utils';

export default class ReviewContainer extends InboxContainer {
  componentDidMount() {
    const { author, report } = this.state;
    const updatesByAuthor = `${API_URL}/updates?author=${author}`;
    Promise.all([
      get(`${updatesByAuthor}&resolved=0&status=inbox&status=done`),
      get(`${updatesByAuthor}&resolved=0&status=goal&before=${report}`),
      get(`${updatesByAuthor}&report=${report}&status=goal&status=struggle&status=achievement`),
    ]).then(
      ([inbox, prev, current]) => this.setState({
        updates: [...inbox, ...prev, ...current].map(makeUpdate)
      })
    ).catch(console.error);
  }

  render() {
    return (
      <Review
        author={this.state.author}
        report={this.state.report}
        reportDate={this.state.reportDate}

        inbox={this.state.updates.filter(up => up.status === 'inbox')}
        prevgoals={this.state.updates.filter(
          up => up.status === 'goal' && up.reportDate < this.state.reportDate
        )}
        done={this.state.updates.filter(up => up.status === 'done')}
        goals={this.state.updates.filter(
          up => up.status === 'goal' &&
            up.reportDate.getTime() === this.state.reportDate.getTime()
        )}
        struggles={this.state.updates.filter(up => up.status === 'struggle')}
        achievements={this.state.updates.filter(up => up.status === 'achievement')}

        handleTextChange={this.handleTextChange}

        handleStartEdit={this.handleStartEdit}
        handleCancelEdit={this.handleCancelEdit}
        handleSubmitEdit={this.handleSubmitEdit}

        handleStartAdd={this.handleStartAdd}
        handleCancelAdd={this.handleCancelAdd}
        handleSubmitAdd={this.handleSubmitAdd}

        handleResolve={this.handleResolve}
        handleArchive={this.handleArchive}
      />
    );
  }
}
