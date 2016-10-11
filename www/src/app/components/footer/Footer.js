import React from 'react';
import { Link } from 'react-router';

export default function Footer(props) {
  const { children } = props;
  const extraLinks = children ? React.cloneElement(
    children, { className: 'footer__link' }
  ) : null;

  return (
    <footer className="footer">
      {extraLinks}
      <Link to="/about" className="footer__link">About</Link>
    </footer>
  );
}
