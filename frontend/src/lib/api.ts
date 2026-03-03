const BASE_URL = "http://localhost:5000"

export const api = async(endpoint : string, method : string = "GET", body? : any) =>{
    
    const makeRequest = async()=>{
        return fetch(`${BASE_URL}${endpoint}`,{
            method,
            credentials: "include",
            headers:{
                "Content-Type" : "application/json"
            },
            body : body ? JSON.stringify(body) : undefined
        })
    }
    
    let res = await makeRequest()

    if(res.status === 401){
        console.log('res.status',res.status)

        const refresh = await fetch(`${BASE_URL}/api/auth/refresh`,{
            method: "POST",
            credentials: "include"
        })

        console.log('refresh',refresh)

        if(refresh.ok){
            res = await makeRequest()
        }else{
            window.location.href = '/login'
            return
        }
    }
    

    return res.json()
}