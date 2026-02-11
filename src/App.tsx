import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';
import Coaches from './pages/Coaches';
import Contact from './pages/Contact';
import Events from './pages/Events';
import VelocityClasses from './pages/VelocityClasses';
import Store from './pages/Store';
import News from './pages/News';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminCoaches from './pages/Admin/Coaches';
import AdminCoachesEdit from './pages/Admin/CoachesEdit.tsx';
import AdminEvents from './pages/Admin/Events';
import AdminEventsEdit from './pages/Admin/EventsEdit';
import AdminNews from './pages/Admin/News';
import AdminNewsEdit from './pages/Admin/NewsEdit';
import AdminUsers from './pages/Admin/Users';
import AdminUsersEdit from './pages/Admin/UsersEdit';
import AdminProducts from './pages/Admin/Products';
import AdminProductsEdit from './pages/Admin/ProductsEdit';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            <Route path="/coaches" element={
              <Layout>
                <Coaches />
              </Layout>
            } />
            <Route path="/contact" element={
              <Layout>
                <Contact />
              </Layout>
            } />
            <Route path="/events" element={
              <Layout>
                <Events />
              </Layout>
            } />
            <Route path="/velocity-classes" element={
              <Layout>
                <VelocityClasses />
              </Layout>
            } />
            <Route path="/store" element={
              <Layout>
                <Store />
              </Layout>
            } />
            <Route path="/news" element={
              <Layout>
                <News />
              </Layout>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/coaches" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminCoaches />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/coaches/new" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminCoachesEdit />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/coaches/:id/edit" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminCoachesEdit />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminEvents />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events/new" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminEventsEdit />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events/:id/edit" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminEventsEdit />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminNews />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news/new" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminNewsEdit />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news/:id/edit" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminNewsEdit />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users/new" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminUsersEdit />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users/:id/edit" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminUsersEdit />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/products/new" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminProductsEdit />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/products/:id" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <AdminProductsEdit />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/velocity-classes" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminLayout>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-gray-900 mb-4">Velocity Classes Management</h1>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Catch-all route for 404 */}
            <Route path="*" element={
              <Layout>
                <NotFound />
              </Layout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;