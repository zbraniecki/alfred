import React from 'react';

export function Previous(props) {
  const { onStartEdit, onResolve } = props;
  return (
    <li className="update">
      <span onClick={onStartEdit}>{props.children}</span>
      <div className="update__actions">
        <span className="update__hint">mark as</span>
        <button className="update__action" onClick={() => onResolve('done')}>done</button>
        <span className="update__hint">or report as</span>
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
        <span className="update__hint">report as</span>
        <button className="update__action" onClick={() => onResolve('achievement')}>achievement</button>
        <span className="update__hint">or</span>
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
