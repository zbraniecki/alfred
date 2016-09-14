import React from 'react';

export function Previous(props) {
  const { onStartEdit, onResolve } = props;
  return (
    <li className="update">
      <span onClick={onStartEdit}>{props.children}</span>
      <div className="update__actions">
        mark as
        <button className="update__action" onClick={() => onResolve('done')}>done</button>
        or report as:
        <button className="update__action" onClick={() => onResolve('goal')}>goal</button>
        <button className="update__action" onClick={() => onResolve('struggle')}>struggle</button>
        <button className="update__action" onClick={() => onResolve('achievement')}>achievement</button>
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
        report as
        <button className="update__action" onClick={() => onResolve('achievement')}>achievement</button>
        or
        <button className="update__action" onClick={onArchive}>archive</button>
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
          className="report__edit"
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
      onResolve={status => props.handleResolve(update, status, props.reportDate)}
      onArchive={() => props.handleArchive(update)}
    >
      {update.text}
    </Update>
  );
}

