import {readFileSync} from 'fs'

class ValidadeData{
    async execute (targetFile){  
        console.log(__dirname + "/content/" + targetFile + ".json");
        
            try {
            
              var uploadedFile = readFileSync( './src/content/' + targetFile + ".json", 'utf8');
                
                
                return uploadedFile;
            } catch (error) {
                console.log("Atenção!!! \n\n Houve um erro ao carregar : " + targetFile)
            }
          }
    }
export { ValidadeData}