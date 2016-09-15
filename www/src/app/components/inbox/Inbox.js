import React from 'react';

import { UpdateList, Previous, Done } from './Update';
import { emptyInboxQuips, emptyPreviousQuips, emptyDoneQuips }
  from '../../messages';

export default function Review(props) {
  return (
    <div>

      <header className="header">
        <div className="logo logo--blue"></div>
        <h1 className="header__title">{props.author}, here's your inbox</h1>
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

      </div>
    </div>
  );
}
