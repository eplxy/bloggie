import './App.css';
import Layout from './components/Layout';
import { Route, Routes } from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import CreatePost from './pages/CreatePost';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './userContext/UserContext';
import PostPage from './pages/PostPage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<IndexPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />

          <Route path = "/post/:id" element = {<PostPage />}></Route>


        </Route>
      </Routes>
    </UserContextProvider>

  );
}

export default App;
