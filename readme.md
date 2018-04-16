# React Heatmap 

A simple React component to show your mouse position density on a js canvas

[Example](https://5z1vqo5w0k.codesandbox.io/)


```javascript
import React from 'react';
import { render } from 'react-dom';
import Heat from 'react-heat'

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

const App = () => (
  <Heat>
    <div style={styles}>
      <h2>I am on fire {'\u2728'}</h2>
    </div>
  </Heat>
);

render(<App />, document.getElementById('root'));
```
