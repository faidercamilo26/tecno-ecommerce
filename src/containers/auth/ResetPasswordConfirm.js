import Layout from '../../hocs/Layout';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { login } from '../../redux/actions/auth';
import {reset_password_confirm} from '../../redux/actions/auth';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

const ResetPasswordConfirm = ({
  reset_password_confirm,
  loading
}) => {

  const params = useParams();
   
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const [formData, setFormData] = useState({
        password: '',
        re_password: '',
      })

      const { 
        password,
        re_password
      } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const [requestSent, setRequestSent] = useState(false);

    const onSubmit = e => {
        e.preventDefault();
        const uid = params.uid;
        const token = params.token;
        reset_password_confirm(uid, token,password, re_password);
        setRequestSent(true);
        window.scrollTo(0,0)
    }

    if(requestSent && !loading){
        return <Navigate to="/" />
    }

    return (
            <Layout>
              <main className="w-full flex">
                <div className="relative flex-1 hidden items-center justify-center h-screen bg-gray-900 lg:flex">
                  <img src="/images/ecommerce.png" alt="E-commerce" className="w-full h-full object-cover" />
                </div>
        
                <div className="flex-1 flex items-center justify-center h-screen -mt-20">
                  <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
                    <div className="flex flex-col items-center justify-center h-13">
                      <img src="/images/logo.png" alt="Logo" width="300" className="mx-auto mb-2" />
                    </div>
                    <div className="">
                      <div className="mt-2 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Set you new password</h3>
                      </div>
                    </div>
                    <form onSubmit={(e) => onSubmit(e)} className="space-y-6">
                      <div>
                        <label className="font-medium">Password</label>
                        <input
                          name="password"
                          value={password}
                          onChange={(e) => onChange(e)}
                          type="password"
                          placeholder='Password'
                          required
                          className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                          <label className="font-medium">Repeat password</label>
                        <input
                          name="re_password"
                          value={re_password}
                          onChange={(e) => onChange(e)}
                          placeholder='Repeat password'
                          type="password"
                          required
                          className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                      </div>
                      {loading ?
                      <button
                      className="inline-flex mt-12 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                      <Oval
                      color="#FFFFFF"
                      height={20}
                      width={20}
                      />
                      </button> :
                          <button
                          type="submit"
                          className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                        >
                          Reset password
                        </button>
                      }
                    </form>
                  </div>
                </div>
              </main>
            </Layout>
          )
}

const mapStateToProps = state => ({
  loading: state.Auth.loading
})

export default connect(mapStateToProps, {
  reset_password_confirm,
}) (ResetPasswordConfirm);