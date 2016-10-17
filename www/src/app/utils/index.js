import React from 'react';

export function get(url) {
  return fetch(url).then(resp => resp.json());
}

export function post(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body)
  });
}

const dtf = Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export function reportName(date) {
  return dtf.format(date);
}

export function makeReport(report) {
  return {
    slug: report.slug,
    reportDate: new Date(report.reportDate),
  };
}

export function makeUpdate(up) {
  return {
    _id: up._id,
    author: up.author,
    channel: up.channel,
    status: up.status,
    resolved: up.resolved,
    text: up.text,
    createdAt: new Date(up.createdAt),
    reportDate: new Date(up.reportDate),
    prev: up.prev
  };
}

export function randElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createAction(type, payload) {
  let error = payload instanceof Error;

  return {
    type,
    payload,
    error
  };
}

export function createAsyncAction(startType, completeType, asyncFn) {
  return (dispatch) => {
    dispatch(createAction(startType));

    let actionCompleted = createAction.bind(null, completeType);
    return asyncFn(dispatch).then((data) => {
      dispatch(actionCompleted(data));
      return data;
    }).catch((error) => {
      dispatch(actionCompleted(error));
      throw error;
    });
  };
}

const bugRe = /bug ([0-9]+)/ig;
const urlRe =
  /(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/ig;

export function linkify(str) {
  str = str.replace(
    urlRe,
    '<a href="$&">$&</a>'
  );
  str = str.replace(
    bugRe,
    '<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=$1">$&</a>'
  );
  return React.createElement('span', {
    dangerouslySetInnerHTML: {
      __html: str
    }
  })
}
