import React from 'react';

export function Previous(props) {
  return (
    <li>
      <span onClick={props.handleStartEdit}>{props.children}</span>
      <div className="toolbar">
        <button onClick={() => props.handleResolve('done')}>done</button>
        <button onClick={() => props.handleResolve('todo')}>todo</button>
        <button onClick={() => props.handleResolve('struggle')}>struggle</button>
      </div>
    </li>
  );
}

export function Reviewed(props) {
  return (
    <li>
      <span onClick={props.handleStartEdit}>{props.children}</span>
    </li>
  );
}

function Editable(props) {
  const { update, handleTextChange, handleSubmitEdit } = props;
  return (
    <li>
      <form onSubmit={handleSubmitEdit}>
        <input type="text" value={update.text} onChange={handleTextChange}/>
      </form>
    </li>
  );
}

export function createUpdate(Update, props, update) {
  if (update.editable) {
    return <Editable
      key={update.createdAt}
      handleTextChange={evt => props.handleTextChange(update, evt)}
      handleSubmitEdit={evt => props.handleSubmitEdit(update, evt)}
      update={update}/>
  }

  return (
    <Update
      key={update.createdAt}
      handleStartEdit={() => props.handleStartEdit(update)}
      handleResolve={status => props.handleResolve(update, status, props.reportDate)}
    >
      {update.text}
    </Update>
  );
}

