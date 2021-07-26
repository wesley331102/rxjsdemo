import './App.css';
import React, { useState } from 'react';
import { Subject, merge } from 'rxjs';
import { Button, Divider, Card, Collapse, message } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';

const { Panel } = Collapse;

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

function App() {

  const [A, setA] = useState(0);
  const [B, setB] = useState(0);
  const [all, setAll] = useState(0);
  const [differ, setDiffer] = useState(0);

  const [AList, setAList] = useState([]);
  const [BList, setBList] = useState([]);
  const [allList, setAllList] = useState([]);


  // For A, B and None's observable
  const buttonA = new Subject();
  const buttonB = new Subject();
  const buttonNone = new Subject();


  // (A merge B)'s observable(for difference)
  const buttonBoth = merge(buttonA, buttonB);
  // (All)'s observable(for count all)
  const buttonAll = merge(buttonA, buttonB, buttonNone);


  // A observer
  const observerA = {
    next: () => setA(A + 1),
    error: err => console.error('observerA got an error: ' + err),
    complete: () => console.log('observerA got a complete notification'),
  };

  // B observer
  const observerB = {
    next: () => setB(B + 1),
    error: err => console.error('observerB got an error: ' + err),
    complete: () => console.log('observerB got a complete notification'),
  };

  // difference observer
  const observerDiffer = {
    next: (data) => {
      if (data === 'A') {
        setDiffer(differ + 1);
      } else if (data === 'B') {
        setDiffer(differ - 1);
      }
    },
    error: err => console.error('observerDiffer got an error: ' + err),
    complete: () => console.log('observerDiffer got a complete notification'),
  };

  // sum observer
  const observerSum = {
    next: () => setAll(all + 1),
    error: err => console.error('observerSum got an error: ' + err),
    complete: () => console.log('observerSum got a complete notification'),
  };


  // stream observer
  const observerStream = {
    next: (data) => {
      const newAList = AList;
      const newBList = BList;
      const newAllList = allList;
      if (data === 'A') {
        newAList.push(<HeartTwoTone twoToneColor="red" />);
        setAList(newAList);
        newBList.push(<HeartTwoTone twoToneColor="grey" />);
        setBList(newBList);
        newAllList.push(<HeartTwoTone twoToneColor="red" />);
        setAllList(newAllList);
      } else if (data === 'B') {
        newAList.push(<HeartTwoTone twoToneColor="grey" />);
        setAList(newAList);
        newBList.push(<HeartTwoTone twoToneColor="green" />);
        setBList(newBList);
        newAllList.push(<HeartTwoTone twoToneColor="green" />);
        setAllList(newAllList);
      } else {
        newAList.push(<HeartTwoTone twoToneColor="grey" />);
        setAList(newAList);
        newBList.push(<HeartTwoTone twoToneColor="grey" />);
        setBList(newBList);
        newAllList.push(<HeartTwoTone twoToneColor="grey" />);
        setAllList(newAllList);
      }
    },
    error: err => console.error('observerStream got an error: ' + err),
    complete: () => console.log('observerStream got a complete notification'),
  };


  // A subscribe A
  buttonA.subscribe(observerA);
  // B subscribe B
  buttonB.subscribe(observerB);
  // sum observer subscribe the merge of all
  buttonAll.subscribe(observerSum);
  // difference observer subscribe the merge of A and B
  buttonBoth.subscribe(observerDiffer);


  // stream observer subscribe the merge of all
  buttonAll.subscribe(observerStream);

  const showWinner = () => {
    if (A > B) {
      message.success("A wins!", 5);
    } else if (B > A) {
      message.success("B wins!", 5);
    } else {
      message.info("Tie!", 5);
    }
  };

  return (
    <div className='App'>
      <div className='App-title'>
        投票系統模擬
        <div className='App-buttons'>
          <div className='App-button'>
            <Button type="primary" onClick={() => buttonA.next('A')} className='A' size='large'>A</Button>
          </div>
          <div className='App-button'>
            <Button type="primary" onClick={() => buttonB.next('B')} className='B' size='large'>B</Button>
          </div>
          <div className='App-button'>
            <Button type="primary" onClick={() => buttonNone.next('None')} className='None' size='large'>None</Button>
          </div>
        </div>
        <Divider />
        <Card title="數據統計">
          <Card.Grid hoverable={false} style={gridStyle}>
            A
          </Card.Grid>
          <Card.Grid hoverable={false} style={gridStyle}>
            B
          </Card.Grid>
          <Card.Grid hoverable={false} style={gridStyle}>
            總和 ( All )
          </Card.Grid>
          <Card.Grid hoverable={false} style={gridStyle}>
            差異 ( A - B )
          </Card.Grid>
          <Card.Grid style={gridStyle}>{A}</Card.Grid>
          <Card.Grid style={gridStyle}>{B}</Card.Grid>
          <Card.Grid style={gridStyle}>{all}</Card.Grid>
          <Card.Grid style={gridStyle}>{differ}</Card.Grid>
        </Card>
        <Divider />
        <div className='App-buttons'>
          <div className='App-button'>
            <Button type="primary" onClick={() => {
              buttonA.complete();
              buttonB.complete();
              buttonNone.complete();
              showWinner();
            }} className='Finish' size='large'>Finish!</Button>
          </div>
        </div>
      </div>
      <div className='App-main'>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="A" key="1">
              <p>--------------------------------------------------</p>
              {AList.length === 0 ? <p>----------------------None---------------------</p> : <p>{AList}</p>}
              <p>--------------------------------------------------</p>
            </Panel>
            <Panel header="B" key="2">
              <p>--------------------------------------------------</p>
              {BList.length === 0 ? <p>----------------------None---------------------</p> : <p>{BList}</p>}
              <p>--------------------------------------------------</p>
            </Panel>
            <Panel header="所有" key="3">
              <p>--------------------------------------------------</p>
              {allList.length === 0 ? <p>----------------------None---------------------</p> : <p>{allList}</p>}
              <p>--------------------------------------------------</p>
            </Panel>
          </Collapse>
      </div>
    </div>
  );
}

export default App;
