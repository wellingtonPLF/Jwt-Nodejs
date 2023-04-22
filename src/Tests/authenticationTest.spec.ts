import { AuthRequest } from "../Interfaces/AuthRepository";
import { app } from "../server";
import chaiHttp from "chai-http";
import chai from 'chai';
import { TokenService } from "../Services/TokenService";

//Config
chai.use(chaiHttp);
const tokenService = new TokenService()

describe('authenticate + createUser', () => {
    
    it('should be able to authenticate', async () => {
        //Arrange
        const auth: AuthRequest = {
            email: "well@gmail.com",  
            password: "12345678"
        };

        //Acts
        const result = await chai.request(app)
        .post('/usuarios/authentication')
        .send(auth)

        //Assert
        chai.expect(result).to.have.status(201);
    })

    it('should return a boolean', async () => {
        //Arrange
        const tokenDB = await tokenService.findByAuthID(1)
        const key = 'accessToken='+ tokenDB.key

        //Acts
        const result = await chai.request(app)
        .get('/usuarios/isLoggedIn')
        .set('Cookie', key);

        //Assert
        chai.expect(result.body).to.deep.equal({data: true});
    });
})
