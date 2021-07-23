import './App.css';
import React, { useState } from 'react';
import { Subject, merge } from 'rxjs';
import { Button, Divider, Card } from 'antd';


const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

const tabList = [
  {
    key: 'A',
    tab: 'A',
  },
  {
    key: 'B',
    tab: 'B',
  },
  {
    key: '所有',
    tab: '所有',
  },
];

function App() {

  const [A, setA] = useState(0);
  const [B, setB] = useState(0);
  const [all, setAll] = useState(0);
  const [differ, setDiffer] = useState(0);

  const [AList, setAList] = useState([]);
  const [BList, setBList] = useState([]);
  const [allList, setAllList] = useState([]);

  const [tabkey, setTabkey] = useState('A');


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
    error: err => console.error('observerB got an error: ' + err),
    complete: () => console.log('observerB got a complete notification'),
  };

  // sum observer
  const observerSum = {
    next: () => setAll(all + 1),
    error: err => console.error('observerB got an error: ' + err),
    complete: () => console.log('observerB got a complete notification'),
  };


  // stream observer
  const observerStream = {
    next: (data) => {
      const newAList = AList;
      const newBList = BList;
      const newAllList = allList;
      if (data === 'A') {
        newAList.push('A');
        setAList(newAList);
        newBList.push('-');
        setBList(newBList);
        newAllList.push('A');
        setAllList(newAllList);
      } else if (data === 'B') {
        newAList.push('-');
        setAList(newAList);
        newBList.push('B');
        setBList(newBList);
        newAllList.push('B');
        setAllList(newAllList);
      } else {
        newAList.push('-');
        setAList(newAList);
        newBList.push('-');
        setBList(newBList);
        newAllList.push('-');
        setAllList(newAllList);
      }
    },
    error: err => console.error('observerB got an error: ' + err),
    complete: () => console.log('observerB got a complete notification'),
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


  const getContentByTabkey = (key) => {
    if (key === 'A') {
      return AList;
    } else if (key === 'B') {
      return BList;
    } else {
      return allList;
    }
  }
  
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
      </div>
      <div className='App-main'>
        <Card
          style={{ width: '100%' }}
          title="資料流總表"
          tabList={tabList}
          activeTabKey={tabkey}
          onTabChange={key => {
            setTabkey(key);
          }}
        >
          {getContentByTabkey(tabkey)}
        </Card>
      </div>
    </div>
  );
}

export default App;
