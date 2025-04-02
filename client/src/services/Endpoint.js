import axios from 'axios'
export const BaseUrl=import.meta.env.VITE_SERVER_APP_URL

 const instance=axios.create({
    baseURL:BaseUrl,
    withCredentials:true,
    
    
})
// export const instance2=axios.create({
//     baseURL:BaseUrl,
//     headers: {
//         'Content-Type': 'application/json',
//       },
    
    
// })


const API = axios.create({
    baseURL:BaseUrl,
});


export const get =(url,params)=>instance.get(url,{params})
export const post=(url,data)=>instance.post(url,data)
export const classPost = (url, data) => instance.post(url, data);
export const classGet =(url,params)=>instance.get(url,{params})
export const addstudentsPost=(url,data)=>instance.post(url,data)
export const deleteRequest = (url, data) => instance.delete(url, { data });

// export const getUser=(url,params)=>instance.get(url,{params})





export const getUser = async () => {
    try {
        const response = await API.get('/auth/getusers', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // or wherever the token is stored
              },
        });
        // console.log('API response:', response);
        return response;
    } catch (error) {
        console.error('Failed to fetch current user:', error);
        throw error;
    }
};