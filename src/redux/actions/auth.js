import {
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    REFRESH_SUCCESS,
    REFRESH_FAIL,
    LOGOUT,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    RESET_PASSWORD_CONFIRM_FAIL

} from './types'
import Cookies from 'js-cookie';
import axios from 'axios'
import { setAlert } from './alert';

export const check_authenticated = () => async dispatch => {

    if (localStorage.getItem('access')){
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    
        const body = {
            token : localStorage.getItem('access')
        }
    
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/verify/`, body, config);
    
            if (res.status === 200){
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATED_FAIL
                })
            }
        }catch(err){
            dispatch({
                type: AUTHENTICATED_FAIL
            })
        }
    } else {
        dispatch({
            type: AUTHENTICATED_FAIL
        })
    }
}

export const signup = (first_name, last_name, email, password, re_password) => async dispatch => {
    dispatch({ type: SET_AUTH_LOADING });

    const csrftoken = Cookies.get('csrftoken');
    console.log(csrftoken)
    
    const config = {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    }

    const body = JSON.stringify({ 
        first_name, 
        last_name, 
        email, 
        password, 
        re_password 
    });

    try{
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`, body, config);

        if (res.status === 201){
            dispatch({
                type: SIGNUP_SUCCESS,
                payload: res.data
            })
            dispatch(setAlert("Te enviamos un correo para que realices la activacion de tu cuenta.", "success"));
        } else {
            dispatch({
                type: SIGNUP_FAIL
            })
            dispatch(setAlert("Algo salio mal, intenta de nuevo.", "error"));
        }
        dispatch({ type: REMOVE_AUTH_LOADING });
    }catch(err){
        const primeraClaveError = Object.keys(err.response.data)[0];
        const mensajeError = (Array.isArray(err.response.data[primeraClaveError]) ? err.response.data[primeraClaveError][0] : err.response.data[primeraClaveError]);
        dispatch({
            type: SIGNUP_FAIL
        })
        dispatch({ type: REMOVE_AUTH_LOADING });
        dispatch(setAlert(mensajeError, "error"));
    }

}

export const load_user = () => async dispatch => {
    if(localStorage.getItem('access')){
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        try{
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
            console.log(res)
            if (res.status === 200){
                dispatch({
                    type: USER_LOADED_SUCCESS,
                    payload: res.data
                });
            }

            else {
                dispatch({
                    type: USER_LOADED_FAIL
                });
            }
        }catch(err){
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
}

export const activate = (uid, token) => async dispatch => {
    dispatch({ type: SET_AUTH_LOADING });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ uid, token });

    try{
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, body, config);

        if (res.status === 204){
            dispatch({
                type: ACTIVATION_SUCCESS
            })
            dispatch(setAlert("Cuenta activada correctamente.", "success"));
        } else {
            dispatch({
                type: ACTIVATION_FAIL
            })
            dispatch(setAlert("Algo salio mal, intenta de nuevo.", "error"));
        }
        dispatch({ type: REMOVE_AUTH_LOADING });

    } catch(err){
        dispatch({
            type: ACTIVATION_FAIL
        })
        dispatch({ type: REMOVE_AUTH_LOADING });
        dispatch(setAlert("Error conectando con el servidor, intenta de nuevo más tarde.", "error"));
    }


}

export const login = (email, password) => async dispatch => {
    dispatch({ type: SET_AUTH_LOADING });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password });

    try{
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config);

        if (res.status === 200){
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
            dispatch(load_user());
            dispatch(setAlert("Welcome again", "success"));
        } else {
            dispatch({
                type: LOGIN_FAIL
            })
            dispatch(setAlert("Incorrect email or password", "error"));
        }
        dispatch({ type: REMOVE_AUTH_LOADING });
    }catch(err){
        dispatch({
            type: LOGIN_FAIL
        })
        dispatch({ type: REMOVE_AUTH_LOADING });
        dispatch(setAlert("Incorrect email or password", "error"));
    }
}

export const refresh = () => async dispatch => {
    if (localStorage.getItem('refresh')){
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    
        const body = {
            refresh : localStorage.getItem('refresh')
        }
    
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/refresh/`, body, config);
    
            if (res.status === 200){
                dispatch({
                    type: REFRESH_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: REFRESH_FAIL
                })
            }
        }catch(err){
            dispatch({
                type: REFRESH_FAIL
            })
        }
    }
}

export const reset_password = (email) => async dispatch => {
    dispatch({ type: SET_AUTH_LOADING });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email });

    try{
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, body, config);

        if (res.status === 204){
            dispatch({
                type: RESET_PASSWORD_SUCCESS,
                payload: res.data
            })
            dispatch({
                type: REMOVE_AUTH_LOADING
            })
            dispatch(setAlert("We will send you an email so you can recover your password.", "success"));
        } else {
            dispatch({
                type: RESET_PASSWORD_FAIL
            })
            dispatch({
                type: REMOVE_AUTH_LOADING
            })
            dispatch(setAlert("Error sending password reset email.", "error"));
        }
        dispatch({ type: REMOVE_AUTH_LOADING });
    }catch(err){
        dispatch({
            type: RESET_PASSWORD_FAIL
        })
        dispatch({ type: REMOVE_AUTH_LOADING });
        dispatch(setAlert("Error sending password reset email.", "error"));
    }
}

export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    })

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (new_password !== re_new_password){
        dispatch({
            type: RESET_PASSWORD_CONFIRM_FAIL
        })
        dispatch({
            type: REMOVE_AUTH_LOADING
        })
        dispatch(setAlert("Passwords don't match.", "error"));
        return;
    }

    const body = JSON.stringify({ uid, token, new_password, re_new_password });

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, body, config);

    try{
        if (res.status === 204){
            dispatch({
                type: RESET_PASSWORD_CONFIRM_SUCCESS
            })
            dispatch({
                type: REMOVE_AUTH_LOADING
            })
            dispatch(setAlert("Password changed successfully.", "success"));
        } else {
            dispatch({
                type: RESET_PASSWORD_CONFIRM_FAIL
            })
            dispatch({
                type: REMOVE_AUTH_LOADING
            })
            dispatch(setAlert("Error changing password.", "error"));
        }
    } catch(err){
        dispatch({
            type: RESET_PASSWORD_CONFIRM_FAIL
        })
        dispatch({
            type: REMOVE_AUTH_LOADING
        })
        dispatch(setAlert("Error changing password.", "error"));
    }
    
}

export const logout = () => async dispatch => {
    dispatch(
        { type: LOGOUT }
    );
    dispatch(setAlert("Succesfuly logged out", "success"));
}

