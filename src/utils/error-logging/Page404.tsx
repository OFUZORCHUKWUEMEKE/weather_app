import React from 'react';
import { pageurl } from '../../utils/constants';
import './Page404.scss';

const Page404: React.FC = () => {
  return (
      <div className='page404'>
        <h2>This is not the page you are looking for...</h2>
        <button onClick={() => (window.location.href = pageurl.HOMEPAGE)}>Go back to Home</button>
      </div>
  );
};

export default Page404;
