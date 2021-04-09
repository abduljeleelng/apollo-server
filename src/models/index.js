import Sequelize from 'sequelize';
import User from './user';
import Message from './message';


let sequelize;
if (process.env.DATABASE_URL) {
sequelize = new Sequelize(process.env.DATABASE_URL, {
dialect: 'postgres',
});
}else{
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      host:'localhost',
      dialect: 'postgres',
      pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
      }
    },
  );

}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  })

  const models = {
    User: sequelize.import('./user'),
    Message: sequelize.import('./message'),
  };


Object.keys(models).forEach(key => {
  //console.log({key})
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize , User, Message};

export default models;
