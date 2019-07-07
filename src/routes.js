import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Message from './components/pages/Message'

export default [
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/',
    component: Login
  },
  {
    path: "/message", 
    component: Message
  }
];
