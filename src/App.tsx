import './App.css';
import ThreeScene from './components/ThreeScene';

function App() {
  return (
    <>
      <ThreeScene />
      <iframe
        src="/index.html"
        title="Embedded Page"
        width="100%"
        height="100%"
        style={{
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
    </>
  );
}

export default App;
