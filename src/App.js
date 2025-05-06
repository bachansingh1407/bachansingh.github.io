
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import Experience from './pages/Experience';
import ErrorPage from './pages/ErrorPage';

const AppLayout = () => {
  return (
    <>
     <Navbar />
      <Outlet />
    </>
  )
}


const router = createBrowserRouter([
  {
    path:'/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children:[
      { path: '/', element: <Home />},
      { path: '/skills', element: <Skills />},
      { path: '/experience', element: <Experience />}, 
      { path: '/projects', element: <Projects />},
      { path: '/contact', element: <Contact />} 
    ]
  }
])

function App() {
  return (
    <>
    <RouterProvider router={router}></RouterProvider>
    <Toaster />
    </>
  );
}

export default App;
