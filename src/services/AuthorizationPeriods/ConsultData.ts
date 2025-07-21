

class ConsultData{
   async execute({authorization,dtInicio,dtFim,card,cpf}){
        const url = `http://192.168.30.207:31080/api/hat/v1/authorizationPeriods?dtInicio=${dtInicio}&dtFim=${dtFim}`

        const result = await fetch (url,{
            method: "GET",
            headers: {"authorization" : authorization,
                      "x-carteira" : card,
                      "x-cpf": cpf}
        }
        
        )
        const data = await result.json()
        
        return data;
       
        

    }
}

export { ConsultData };