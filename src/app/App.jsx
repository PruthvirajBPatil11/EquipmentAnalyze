import { useState } from 'react';
import { useApp } from '../store/AppStore.jsx';
import Login from '../components/Login.jsx';
import Navbar from '../components/Navbar.jsx';
import Twin from '../features/twin/Twin.jsx';
import Upload from '../features/upload/Upload.jsx';
import History from '../features/history/History.jsx';
import Suggestions from '../features/suggestions/Suggestions.jsx';

export default function App() {
  const { user } = useApp();
  const [view, setView] = useState('twin');
  if (!user) return <Login />;
  return (
    <>
      <Navbar view={view} setView={setView} />
      <main>
        {view === 'twin' && <Twin go={setView} />}
        {view === 'upload' && <Upload go={setView} />}
        {view === 'history' && <History />}
        {view === 'suggestions' && <Suggestions />}
      </main>
    </>
  );
}
