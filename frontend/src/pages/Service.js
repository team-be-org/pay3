import {React} from 'react';
import Main from '../components/ServiceMain';
import Operation from '../components/ServiceOperation';
import {RecoilRoot} from 'recoil';

function App() {
  return (
    <div className="container">
      <RecoilRoot>
        <div className="panel">
          < Operation />
        </div>
        <div className="main">
          < Main />
        </div>
      </RecoilRoot>
    </div>
  );
}

export default App;