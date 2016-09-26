import React from 'react';

import { randElem } from '../../utils';

export function Incoming(props) {
  const { onStartEdit, onResolve } = props;
  return (
    <li className="update">
      <span onClick={onStartEdit}>{props.children}</span>
      <div className="update__actions">
        <span className="update__hint">mark as</span>
        <button className="action" onClick={() => onResolve('xxx')}>current goal</button>
        <button className="action" onClick={() => onResolve('todo')}>todo</button>
        <button className="action" onClick={() => onResolve('done')}>done</button>
      </div>
    </li>
  );
}

export function Todo(props) {
  const { onStartEdit, onResolve } = props;
  return (
    <li className="update">
      <span onClick={onStartEdit}>{props.children}</span>
      <div className="update__actions">
        <span className="update__hint">mark as</span>
        <button className="action" onClick={() => onResolve('done')}>done</button>
        <span className="update__hint">or report as</span>
        <button className="action" onClick={() => onResolve('goal')}>goal for next week</button>
        <button className="action" onClick={() => onResolve('struggle')}>struggle</button>
      </div>
    </li>
  );
}

export function Done(props) {
  const { onStartEdit, onResolve, onArchive } = props;
  return (
    <li className="update">
      <del className="update__text--done" onClick={onStartEdit}>{props.children}</del>
      <div className="update__actions">
        <span className="update__hint">report as</span>
        <button className="action" onClick={() => onResolve('achievement')}>achievement</button>
        <span className="update__hint">or</span>
        <button className="action" onClick={onArchive}>archive</button>
      </div>
    </li>
  );
}

export function Reviewed(props) {
  const { onStartEdit } = props;
  return (
    <li className="update">
      <span onClick={onStartEdit}>{props.children}</span>
    </li>
  );
}

function Editable(props) {
  const { value, onChange, onBlur, onSubmit } = props;
  return (
    <li className="update">
      <form onSubmit={onSubmit}>
        <input type="text"
          className="update__edit"
          autoFocus
          required
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </form>
    </li>
  );
}

// XXX should this be an intermediary component?
export function createUpdate(Update, props, update) {
  if (update.editable) {
    const handleCancel = update.adding ?
      props.handleCancelAdd : props.handleCancelEdit;
    const handleSubmit = update.adding ?
      props.handleSubmitAdd : props.handleSubmitEdit;
    return <Editable
      key={update._id}
      onChange={evt => props.handleTextChange(update, evt)}
      onBlur={evt => handleCancel(update, evt)}
      onSubmit={evt => handleSubmit(update, evt)}
      value={update.text}
    />
  }

  return (
    <Update
      key={update._id}
      onStartEdit={() => props.handleStartEdit(update)}
      onResolve={status => props.handleResolve(update, status)}
      onArchive={() => props.handleArchive(update)}
    >
      {update.text}
    </Update>
  );
}

export function UpdateList(props) {
  const { className, children, name, item, quips } = props;
  // XXX should this use React.Children?
  const content = children.length === 0 ?
    <div className="tile__empty-msg">{randElem(quips)}</div> :
    <ul className="tile__updates">
      {children.map(up => createUpdate(item, props, up))}
    </ul>

  return (
    <section className={className}>
      <h2 className="tile__title">{name}</h2>
      {content}
    </section>
  );
}
