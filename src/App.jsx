import React from 'react';
import ParticipantView from './components/ParticipantView';
import HostView from './components/HostView';

function App() {
  // Simple routing based on URL path
  const isHost = window.location.pathname === '/host';

  return (
    <div>
      {isHost ? <HostView /> : <ParticipantView />}
    </div>
  );
}

export default App;
