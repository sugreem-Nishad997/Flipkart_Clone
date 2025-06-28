import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const jwt = jsonwebtoken;
const secret = process.env.SECRET_KEY;

const createSecretToken = (id) => {
    return jwt.sign({id}, secret, {
        expiresIn:"1d"
    })
}

export{createSecretToken}