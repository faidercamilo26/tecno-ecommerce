import {
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAIL
} from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const getCategories = () => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/category/categories`, config);

    try{
        if (res.status === 200){
            dispatch({
                type: GET_CATEGORIES_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_CATEGORIES_FAIL
            });
            dispatch(setAlert('Failed to get categories', 'error'));
        }
    } catch(err){
        dispatch({
            type: GET_CATEGORIES_FAIL
        });
        dispatch(setAlert('Failed to get categories', 'error'));
    }
    
}; 