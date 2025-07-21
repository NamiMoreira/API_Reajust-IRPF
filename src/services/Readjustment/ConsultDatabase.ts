import {readFileSync} from 'fs'
import {oracledb, doRelease,initOracleClient,getConnection} from 'oracledb'

class ConsultDatabase{
    async execute (card){  
        let select = (readFileSync("./src/content/select.txt",'utf-8')).toString()
        select = select.replace("&cartaoUsuario", card.substr(4));
        select = select.replace("&unidade", card.substr(0, 4));
        const clientOpts = { libDir: "C:/oracle/instantclient_11_2" };
        const config = {
          user: "srcadger",
          password: "srcadger",
          connectString: "192.168.10.2:1521/TASYPRINC",
        };
        try {
            initOracleClient(clientOpts);
          } catch (err) {
            console.error(err);
            process.exit(1);
          }
        
          var valorSelect = await returnReajust();
          async function returnReajust() {
            try {
              const connection = await getConnection(config);
              const result = await connection.execute(select);
              doRelease(connection);
              return result.rows;
            } catch (e) {
              console.log(e);
            }
          }
        
          function doRelease(connection) {
            connection.close(function (err) {
              if (err) console.error(err.message);
            });
          }
        
          return valorSelect;
    
        }
}
export { ConsultDatabase}