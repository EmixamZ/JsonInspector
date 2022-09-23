import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import _ from "lodash"

function App() {
  const supportedLanguage = ['fr', 'en', 'nl']
  const [data, setData] = useState();
  const [props, setProps] = useState([]);
  function compileJson() {

    const or = GetPropArray(data);
    setProps(or);
  }

  return (
    <div className='container mx-auto pt-3'>
      <h1>Template editor</h1>
      <div className='row mb-2'>
        <textarea onChange={(e) => {
          setData(JSON.parse(e.target.value));
          // e.target.style.height = 'inherit';
          // e.target.style.height = `${e.target.scrollHeight}px`;
        }}></textarea>
      </div>

      <button onClick={compileJson} className='btn btn-primary'>Compile</button>

      {props.map(prop => (
        <>
          <hr />
          <div key={prop} className='form-group my-1'>
            <label>{prop}</label>
            <input defaultValue={_.get(data, prop)} onChange={(e) => {
              console.log(e.target.value);
              _.set(data, prop, e.target.value)
              setData(data);
            }} className='form-control mt-1'></input>
          </div>
        </>
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
    const defKey = parentName == '' ? key : parentName + '.' + key;
    if (typeof data[key] == 'object' && !Array.isArray(data[key])) {
      if (data[key]) {
        propArray.push(...GetPropArray(data[key], defKey));
      }
      else{
        propArray.push(defKey);
      }
    }
    else if (defKey === 'configurations.feedbackQuestions') {
      const questionArr = _.get(data, "feedbackQuestions");
      console.log(data, defKey, questionArr);
      questionArr.forEach((q, i) => {
        propArray.push(...GetPropArray(q, `configurations.feedbackQuestions[${i}]`))
      })
    }
    else if (defKey === 'configurations.extraQuestions') {
      const questionArr = _.get(data, "extraQuestions");
      console.log(data, defKey, questionArr);
      questionArr.forEach((q, i) => {
        propArray.push(...GetPropArray(q, `configurations.extraQuestions[${i}]`))
      })
    }
    else if (defKey === 'configurations.thankYouMessages') {
      const questionArr = _.get(data, "thankYouMessages");
      console.log(data, defKey, questionArr);
      questionArr.forEach((q, i) => {
        propArray.push(...GetPropArray(q, `configurations.thankYouMessages[${i}]`))
      })
    }
    else {
      propArray.push(defKey)
    }
  }
  return propArray;
}

export default App;
