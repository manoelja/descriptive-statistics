import { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Items from './components/Items/Items';
import Dashboard from './components/Dashboard/Dashboard';
import FormulasLab from './components/FormulasLab/FormulasLab';
import Contact from './components/Contact/Contact';
import CyberBackground from './components/CyberBackground/CyberBackground';
import './styles/global.css';

function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <div className="App">
      <CyberBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Items />
        <Dashboard />
        <FormulasLab />
        <Contact />
      </main>
    </div>
  );
}
export default App;
