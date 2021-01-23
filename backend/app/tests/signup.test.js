const axios = require( 'axios' );

describe( 'POST@/signup', () => {
    it( 'should create a new user and return a status of 200', async () => {
        //TODO do not hardocode the localhost and 8080
        const result = await axios.post( 'http://localhost:8080/api/auth/signup', {
            username: 'piotrk',
            email: 'pkiszka@gmail.com',
            password: 'advent1',
            roles: ["moderator","user"],
        } );

        expect(result.status).toEqual(200);
        expect(result.data ).toMatchObject({
                                                "message": "User was registered successfully!"
                                            })
//        console.log( 'result', result );
    } );
} );