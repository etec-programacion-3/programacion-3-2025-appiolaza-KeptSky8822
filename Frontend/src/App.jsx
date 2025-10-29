import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}

export default App;