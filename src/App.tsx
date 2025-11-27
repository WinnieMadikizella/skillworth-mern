import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Mentors from './pages/Mentors.tsx';
import Learners from './pages/Learners.tsx';
import Employers from './pages/Employers.tsx';
import Contact from './pages/Contact.tsx';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Toaster position="bottom-right" />
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/for-learners" element={<Learners />} />
            <Route path="/for-employers" element={<Employers />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
