import Layout from '../../hocs/Layout';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { connect } from 'react-redux';
import { activate } from '../../redux/actions/auth';
import { Navigate } from 'react-router-dom';
import Loader from 'react-loader-spinner'
import { Oval } from 'react-loader-spinner';




const Activate = ({
    activate, loading
}) => {
    const params = useParams();

    

    const [activated, setActivated] = useState(false);

    const  activate_account = () => {
        const uid = params.uid;
        const token = params.token;
        activate(uid, token);
        setActivated(true);
    }

    if(activated && !loading){
        return <Navigate to="/" />
    }

    return(
        <Layout>
            <main className="w-full flex">
                <div className="relative flex-1 hidden items-center justify-center h-screen bg-gray-900 lg:flex">
                <img src="/images/ecommerce.png" alt="E-commerce" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex items-center justify-center h-screen">
                <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
                    <div className="">
                    <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Activate Your Account</h3>
                    <p className="mt-2 text-gray-600">Click the button below to activate your account and start shopping!</p>
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
                        </button>: <button
                        onClick={activate_account}
                        className="inline-flex mt-12 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        Activate Account
                    </button>}
                </div>
                </div>
            </main>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
                <div className="max-w-3xl mx-auto">
          
                    
                   
                    
                </div>
            </div>
        </Layout>
    )
}

const mapStateToProps = state => ({
    loading: state.Auth.loading
})

export default connect(mapStateToProps, {
    activate
}) (Activate);