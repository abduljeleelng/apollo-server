
import Sequelize from 'sequelize';

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'postgres',
    },
);

const models = {
    User: sequelize.import('./user'),
    Message: sequelize.import('./message'),
};

Object.keys(models).forEach(key=>{
    if('associate' in models[key]){
        models[key].associate(models)
    }
});




export { sequelize }

export default models





/*
const users = {
    1:{
        id:'1',
        username : "Robin Wieruch",
        messageIds: [1]
    },
    2:{
        id:'2',
        username : "Robin ",
        messageIds: [2]
    },
    3:{
        id:'3',
        username : "Wieruch",
        messageIds: [3]
    },
    4:{
        id:'4',
        username : "Muhammed",
        messageIds: [4]
    },
}


const messages = {
    1:{
        id:'1',
        text: "hello word",
        userId: '1'
    },
    2:{
        id:'2',
        text: "messaging demo",
        userId: '2'
    },
    3:{
        id:'3',
        text: "hello word",
        userId: '3'
    },
    4:{
        id:'4',
        text: "messaging demo",
        userId: '4'
    }
}

const me = users[1];

export default {users, messages}
*/