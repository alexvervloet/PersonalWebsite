import { Page } from './components/Page';

export default function App() {
  return (
    <div style={{ background: '#0e1113', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', boxShadow: '0 0 80px rgba(0,0,0,0.5)' }}>
        <Page />
      </div>
    </div>
  );
}
