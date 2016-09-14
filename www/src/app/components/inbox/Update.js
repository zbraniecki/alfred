import React from 'react';

export function Previous(props) {
  const { onStartEdit, onResolve } = props;
  return (
    <li className="update">
      <span onClick={onStartEdit}>{props.children}</span>
      <div className="update__actions">
        <span className="update__hint">mark as</span>
        <button className="update__action" onClick={() => onResolve('done')}>done</button>
      </div>
    </li>
  );
}

export function Done(props) {
  const { onStartEdit, onArchive } = props;
  return (
    <li className="update">
      <del className="update__text--done" onClick={onStartEdit}>{props.children}</del>
      <div className="update__actions">
        <button className="update__action" onClick={onArchive}>archive</button>
      </div>
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

