import React from 'react';
import { Link } from 'react-router';

import './App.css';

export default function App(props) {
  return (
    <div>
      {props.children}
      <footer className="footer">
        <Link to="/about" className="footer__link">About</Link>
      </footer>
    </div>
  );
}
