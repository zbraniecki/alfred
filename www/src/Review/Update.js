import React from 'react';

export function Previous(props) {
  const { onStartEdit, onResolve } = props;
  return (
    <li>
      <span onClick={onStartEdit}>{props.children}</span>
      <div>
        <button onClick={() => onResolve('done')}>done</button>
        <button onClick={() => onResolve('todo')}>todo</button>
        <button onClick={() => onResolve('struggle')}>struggle</button>
      </div>
    </li>
  );
}

export function Reviewed(props) {
  const { onStartEdit } = props;
  return (
    <li>
      <span onClick={onStartEdit}>{props.children}</span>
    </li>
  );
}

function Editable(props) {
  const { value, onChange, onSubmit } = props;
  return (
    <li>
      <form onSubmit={onSubmit}>
        <input type="text" autoFocus required
          value={value}
          onChange={onChange}
          onBlur={onSubmit}
        />
      </form>
    </li>
  );
}

// XXX should this be an intermediary component?
export function createUpdate(Update, props, update) {
  if (update.editable) {
    const handleSubmit = update.adding ?
      props.handleSubmitAdd : props.handleSubmitEdit;
    return <Editable
      key={update._id}
      onChange={evt => props.handleTextChange(update, evt)}
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

