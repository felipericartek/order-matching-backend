import {AppDataSource} from "../ormconfig";

AppDataSource.initialize()
    .then(() => {
      console.log('🟢 Banco conectado com sucesso!');
    })
    .catch((error) => {
      console.error('🔴 Erro na conexão do banco:', error);
    });
