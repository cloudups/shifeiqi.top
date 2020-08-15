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
        在这里，记录着<a href="https://github.com/cloudups">我</a>的滴滴点点{' '}
        <br />
        （: 生命不息，奋斗不止 :)
      </p>
    </div>
  );
};

export default Bio;
