import { useState } from 'react';
import './App.css';


function App() {

const [task, setTask] = useState('');
const [tasks, setTasks] = useState([]);

  function addTask()
 {
if(task.trim()==="") return;
  setTasks([...tasks,task]);
  setTask("");
 }

  function deleteTask(index) {
    const newTasks=[...tasks];
    newTasks.splice(index,1);
    setTasks(newTasks);

  }
  

  return (
 <div className="todo-container">

<h1>TO-DO List</h1>

<div className="input-area">
  <input type ="text" placeholder='Enter a TasK'
  value={task} 
  onChange={(e) => setTask(e.target.value)}
  onKeyDown={(e)=>{
    if (e.key === "Enter" ) {
     addTask();
    }
  }}
  />
   <button onClick={addTask}>Add</button>

</div>



<ul ClassName="task-list">
 {tasks.map((item,index) => (
  <li ClassName="task" >
  {item}
  
  <button  className="delete-btn"
  onClick={() =>deleteTask(index)} >
    Delete </button>


  </li>
 ))}
</ul>
      
      </div>

      );
 
}

      export default App;

  