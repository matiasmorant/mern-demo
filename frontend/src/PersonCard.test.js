import React from 'react';
import ReactDOM from 'react-dom';
import PersonCard from './PersonCard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PersonCard />, div);
  ReactDOM.unmountComponentAtNode(div);
});
