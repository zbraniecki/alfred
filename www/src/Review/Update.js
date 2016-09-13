import React from 'react';

export function Previous(props) {
  const { onStartEdit, onResolve } = props;
  return (
    <li className="report__item">
      <span onClick={onStartEdit}>{props.children}</span>
      <div className="report__actions">
        <button className="report__action" onClick={() => onResolve('done')}>done</button>
        <button className="report__action" onClick={() => onResolve('todo')}>todo</button>
        <button className="report__action" onClick={() => onResolve('struggle')}>struggle</button>
      </div>
    </li>
  );
}

export function Reviewed(props) {
  const { onStartEdit } = props;
  return (
    <li className="report__item">
      <span onClick={onStartEdit}>{props.children}</span>
    </li>
  );
}

function Editable(props) {
  const { value, onChange, onBlur, onSubmit } = props;
  return (
    <li className="report__item">
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
    >
      {update.text}
    </Update>
  );
}

