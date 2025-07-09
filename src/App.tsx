import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RelationsPage from './pages/RelationsPage';
import BooleanProductsPage from './pages/BooleanProductsPage';
import CompositionPage from './pages/CompositionPage';
import MatrixCompositionPage from './pages/MatrixCompositionPage';
import HomeworkPage from './pages/HomeworkPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/relations" element={<RelationsPage />} />
          <Route path="/boolean-products" element={<BooleanProductsPage />} />
          <Route path="/composition" element={<CompositionPage />} />
          <Route path="/matrix-composition" element={<MatrixCompositionPage />} />
          <Route path="/homework" element={<HomeworkPage />} />
          {/* Additional routes will be added here as you create new pages */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
