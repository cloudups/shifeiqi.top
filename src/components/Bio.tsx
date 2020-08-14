import React from 'react';
import profilePic from '../assets/avator.png';
import { rhythm } from '../utils/typography';

const Bio: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        marginBottom: rhythm(2),
      }}
    >
      <img
        src={profilePic}
        alt={`Feiqi Shi`}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          width: rhythm(2),
          height: rhythm(2),
          borderRadius: '50%',
        }}
      />
      <p style={{ maxWidth: 310 }}>
        Personal blog by{' '}
        <a href="https://github.com/cloudups">Feiqi Shi</a>.{' '}
        <br />
          Enjoy life, enjoy coding.
        </p>
    </div>
  );
}

export default Bio;