const BASE_URL = "http://localhost:5000"

export const api = async(endpoint : string, method : string = "GET", body? : any) =>{
    const res = await fetch(`${BASE_URL}${endpoint}`,{
        method,
        credentials: "include",
        headers:{
            "Content-Type" : "application/json"
        },
        body : body ? JSON.stringify(body) : undefined
    })

    return res.json()
}