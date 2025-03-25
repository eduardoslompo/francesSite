import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Index from './pages/Index.tsx';
import SituationsPage from './pages/SituationsPage.tsx';
import SituationDetailPage from './pages/SituationDetailPage.tsx';
import QuizzesPage from './pages/QuizzesPage.tsx';
import QuizDetailPage from './pages/QuizDetailPage.tsx';
import ResourcesPage from './pages/ResourcesPage.tsx';
import ProgressPage from './pages/ProgressPage.tsx';
import Login from './pages/Login.tsx';
import Cadastro from './pages/Cadastro.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import CompraAcesso from './pages/CompraAcesso.tsx';
import PaginaVendas from './pages/PaginaVendas.tsx';
import NotFound from './pages/NotFound.tsx';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Index />} />
        <Route path="/situations" element={<SituationsPage />} />
        <Route path="/situations/:id" element={<SituationDetailPage />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/quizzes/:id" element={<QuizDetailPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/compra-acesso" element={<CompraAcesso />} />
        <Route path="/pagina-vendas" element={<PaginaVendas />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
