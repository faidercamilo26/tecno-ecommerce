import { Provider } from 'react-redux'
import store from './store'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './containers/Home'
import Error404 from './containers/errors/Error404'

import Signup from '../src/containers/auth/Signup'
import Activate from '../src/containers/auth/Activate'
import Login from '../src/containers/auth/Login'
import ResetPassword from './containers/auth/ResetPassword'
import ResetPasswordConfirm from './containers/auth/ResetPasswordConfirm'
import Shop from './containers/Shop'
import Search from './containers/pages/Search'


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Error display */}
          <Route path="*" element={<Error404 />} />
          {/* Home */}
          <Route exact path="/" element={<Home />} />

          {/* Authentication */}
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/activate/:uid/:token" element={<Activate />} />
          <Route exact path="/reset_password" element={<ResetPassword/>} />
          <Route exact path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm/>} />

          <Route exact path="/search_product" element={<Search />} />


          <Route exact path="/shop" element={<Shop />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
