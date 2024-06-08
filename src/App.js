// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/homepage'; // Ensure case sensitivity matches the filename
import AuthPage from './components/auth'; // This matches your file name 'auth.js'
import Profile from './components/Profile';
import TeacherList from './components/TeacherList';
import TeacherProfile from './components/TeacherProfile';
import CoursePage from './components/CoursePage';
import PostPage from './components/PostPage';
import TeacherForm from './components/TeacherForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/teachers" element={<TeacherList />} />
        <Route path="/teachers/:teacherId" element={<TeacherProfile />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/teachers/edit/:teacherId" element={<TeacherForm />} />
      </Routes>
    </Router>
  );
};

export default App;
