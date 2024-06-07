import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/auth';
import HomePage from './components/homepage';
import LoginPage from './components/LoginPage'; 
import TeacherListPage from './components/TeacherList';
import Profile from './components/Profile';
import TeacherList from './components/TeacherList';
import TeacherProfile from './components/TeacherProfile';
import TeacherForm from './components/TeacherForm';
import PostPage from './components/PostPage';
import CoursesPage from './components/CoursePage';



const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/teachers" element={<TeacherListPage />} />
                <Route path = "/profile" element= {<Profile/>}/>
                <Route path="/teachers" element={<TeacherList />} />
                <Route path="/teachers/:teacherId" element={<TeacherProfile />} />
                <Route path="/teachers/add" element={<TeacherForm />} />
                <Route path="/teachers/edit/:teacherId" element={<TeacherForm />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                

            </Routes>
        </Router>
    );
}



export default App;

