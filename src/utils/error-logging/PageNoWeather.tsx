import React from 'react';
import { pageurl } from '../../utils/constants';
import './PageNoWeather.scss';

const PageNoWeather: React.FC = () => {
  return (
      <div className='PageNoWeather'>
        <h2>Sorry, No Weather information was found</h2>
        <button onClick={() => (window.location.reload())}>Reload</button>
      </div>
  );
};

export default PageNoWeather;