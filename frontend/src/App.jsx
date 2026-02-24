import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadForm from './pages/LeadForm';
import LeadsList from './pages/LeadsList';
import AccountsList from './pages/AccountsList';
import AccountDetail from './pages/AccountDetail';
import OpportunitiesList from './pages/OpportunitiesList';
import OpportunityDetail from './pages/OpportunityDetail';
import ContactsList from './pages/ContactsList';
import Profile from './pages/Profile';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <ThemeProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route element={<ProtectedRoute />}>
                            <Route element={<Layout />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/leads" element={<LeadsList />} />
                                <Route path="/leads/new" element={<LeadForm />} />
                                <Route path="/accounts" element={<AccountsList />} />
                                <Route path="/accounts/:id" element={<AccountDetail />} />
                                <Route path="/opportunities" element={<OpportunitiesList />} />
                                <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                                <Route path="/contacts" element={<ContactsList />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            </Route>
                        </Route>
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </ThemeProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
