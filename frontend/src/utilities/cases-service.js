
import * as casesAPI from './cases-api'


export async function getCases(){
    try {
        const data = await casesAPI.index()
        return data
    }catch(err){
        return err
    }
}
export async function createCase(newCaseData){

    try {
        const data = await casesAPI.create(newCaseData)
        return data
    }catch(err){
        return err
    }
}

export async function getCase(id){
    try{
       const data = await casesAPI.detail(id)
       return data
    }catch(err){
        return err
    }
}


export async function getMostRecentCase(id){
    try{
       const data = await casesAPI.getMostRecentCase(id)
       return data
    }catch(err){
        return err
    }
}

export async function deleteCase(id){
    try{
       const data = await casesAPI.destroy(id)
       return data
    }catch(err){
        return err
    }
}

export async function updateCase(id, data){
    try{
       const resp = await casesAPI.update(id, data)
       return resp
    }catch(err){
        return err
    }
}

export async function sendResponse(id, data) {
    try {
        console.log("sending response case-service")
        const resp = await casesAPI.sendResponse(id, data)
        return resp
    }catch(err) {
        console.log(err)
        return err
    }
}

export async function chatOpenAI(id, data){
    try{
        // console.log("cases service")
        const resp = await casesAPI.chatOpenAI(id, data)
        return resp
    }catch(err){
        return err
    }
}