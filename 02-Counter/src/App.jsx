import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-container">

      <h1 className="counter" style={{ marginTop: '20px' }}><b>Counter</b></h1>


      <div className="display">
        <p>{count}</p>
      </div>
<div className="buttons">
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count >0 ?count-1:0)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    
     </div>

     </div>
  );
};

export default App;