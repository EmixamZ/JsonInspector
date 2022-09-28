
import _ from "lodash";
import { useRef, useState } from 'react';
import './App.css';

function App() {
  const jsonRef = useRef();
  const [data, setData] = useState();
  const [props, setProps] = useState([]);
  function compileJson() {
    const json = jsonRef.current.value;
    const jsonObject = JSON.parse(json);
    setData(jsonObject)
    const or = GetPropArray(jsonObject);
    setProps(or);
  }

  return (
    <div className='container mx-auto pt-3'>
      <h1>JSON Inspector</h1>
      <div className='row mb-2'>
        <textarea ref={jsonRef}></textarea>
      </div>

      <button onClick={compileJson} className='btn btn-primary'>Compile</button>

      {props.map(prop => (
        <div key={prop}>
          <hr />
          <div className='form-group my-1'>
            <label>{prop}</label>
            <input defaultValue={_.get(data, prop)} onChange={(e) => {
              console.log(e.target.value);
              _.set(data, prop, e.target.value)
              setData(data);
            }} className='form-control mt-1'></input>
          </div>
        </div>
      ))}

      {props.length > 0 ? <button onClick={() => {

        console
          .log(data);
      }} className='btn btn-primary mt-2'>Submit</button> : ''}



    </div>
  );
}



function GetPropArray(data, parentName = '') {
  const propArray = [];
  const keys = Object.keys(data);
  for (let key of keys) {
    const defKey = parentName === '' ? key : parentName + '.' + key;
    if (typeof data[key] == 'object' && !Array.isArray(data[key])) {
      if (data[key]) {
        propArray.push(...GetPropArray(data[key], defKey));
      }
      else {
        propArray.push(defKey);
      }
    }
    else if (Array.isArray(data[key])) {
      const questionArr = _.get(data, key);
      console.log(defKey);
      questionArr.forEach((q, i) => {
        propArray.push(...GetPropArray(q, `${defKey}[${i}]`))
      })
    }
    else {
      propArray.push(defKey)
    }
  }
  return propArray;
}

export default App;
