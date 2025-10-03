export function ok<T>(message:string, data?:T){
    return { success: true, message, ...(data !== undefined ? { data } : {}) }
}

export function fail (message:string, issues?:unknown){
    return { success: false, message, ...(issues !== undefined ? { issues } : {}) }
}