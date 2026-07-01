import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const[display , setDisplay]= useState("");

 return (
  <div className="calculator-container">

  
 <h1 className="calculator">Calculator</h1>

 <div clsasName="display">
  <p>{display}</p>
 </div>

 
 
    
      <div className="row">
        <button onClick={() => setDisplay("")}>c</button>
       <button onClick={() => setDisplay(display.slice(0, -1))}>⬅</button>
       <button onClick={() => setDisplay(display + "%")}>%</button>
       <button onClick={() => setDisplay(display + "/")}>/</button>
       

       
      </div>

   <div className="row">
        <button onClick={() => setDisplay(display + "7")}>7</button>
        <button onClick={() => setDisplay(display + "8")}>8</button>
        <button onClick={() => setDisplay(display + "9")}>9</button>
        <button onClick={() => setDisplay(display + "*")}>*</button>

</div>

   <div className="row">
  <button onClick={() => setDisplay(display + "4")}>4</button>
  <button onClick={() => setDisplay(display + "5")}>5</button>
  <button onClick={() => setDisplay(display + "6")}>6</button>
  <button onClick={() => setDisplay(display + "-")}>-</button>
</div>

   <div className="row">
  <button onClick={() => setDisplay(display + "1")}>1</button>
  <button onClick={() => setDisplay(display + "2")}>2</button>
  <button onClick={() => setDisplay(display + "3")}>3</button>
  <button onClick={() => setDisplay(display + "+")}>+</button>
</div>

  <div className="row">
<button className="zero" onClick={() => setDisplay(display + "0")}>0</button>
<button onClick={() => setDisplay(display + ".")}>.</button>
<button onClick={() => setDisplay(eval(display).toString())}>=</button>
  </div>

<div>

</div>

<div>
  

</div>

    </div>


 
 );
 
}

export default App;


