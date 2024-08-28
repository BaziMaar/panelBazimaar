
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ReferredDetails from './components/ReferredDetails';

function App() {
  return (
        <Router>
      <Routes>
        <Route path="/:phone" element={<ReferredDetails/>}/>

      </Routes>
    </Router>
  );
}

export default App;
