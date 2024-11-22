import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Movies from '@/pages/Movies';
import MovieDetails from '@/pages/MovieDetails';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Profile from '@/pages/Profile';
import Reviews from '@/pages/Reviews';
import AboutUs from './pages/AboutUs';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CompareMovies from './pages/CompareMovies';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/compare" element={<CompareMovies />} />
          </Routes>
        </Layout>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
