import { readFileSync } from "fs";
import { oracledb, doRelease, initOracleClient, getConnection } from "oracledb";

class ConsultDatabase {
  async execute( ano, guia) {
    let select = readFileSync(
      "./src/content/selectAutorization.txt",
      "utf-8"
    ).toString();

    select = select.replace("&ano", ano);
    select = select.replace("&guia", guia);

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
    var valueSelect = await returnAutorization();


    async function returnAutorization() {
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
  
    
    console.log(valueSelect);
    
    return valueSelect;
  }
}

export { ConsultDatabase };
