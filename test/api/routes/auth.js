import chai        from 'chai';
import Faker       from 'faker';
import io          from 'socket.io-client';

const expect = chai.expect;

Faker.locale = 'ru';

const email    = Faker.random.number(10000) + Faker.internet.email(Faker.name.firstName(), Faker.name.lastName());
const password = 'jbuhgSSShg74rrr';

export default function testAccount(request) {
    let AUTHOR_ID;

    describe('Authentication (standart)', () => {
        describe('Registration', () => {
            it('should register fake user via API for getting user data to next tests', done => {
                request
                    .post('/account/register')
                    .set('X-Requested-With', 'XMLHttpRequest')
                    .send({
                        name:       Faker.name.firstName(),
                        birthdate:  `01/01/${new Date().getFullYear() - Faker.random.number({ min: 18, max: 60 })}`,
                        city:       Faker.random.number(175),
                        email:      email,
                        password:   password,
                        sex:        'female'
                    })
                    .expect(200)
                    .end(function(err, res) {
                        AUTHOR_ID = res.body.data.user.id;
                        if (err) { return done(err); }
                        done();
                    });
            });

            it('should register fake user', done => {
                request
                    .post('/account/register')
                    .send({
                        name:       Faker.name.firstName(),
                        birthdate:  `01/01/${new Date().getFullYear() - Faker.random.number({ min: 18, max: 60 })}`,
                        city:       Faker.random.number(175),
                        email:      Faker.internet.email(Faker.name.firstName() + Faker.random.number(175), Faker.name.firstName()),
                        password:   password,
                        sex:        Faker.random.boolean() ? 'male' : 'female'
                    })
                    .expect(302)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        done();
                    });
            });
        });

        describe('Logging in', () => {
            it('should login as fake user', done => {
                request
                    .post('/account/login')
                    .send({ email, password })
                    .expect(302)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        done();
                    });
            });
        });

        describe('User area', () => {
            it('should show user info', done => {
                request
                    .get('/account')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        done();
                    });
            });
        });

        describe('Edit user', () => {
            it('should edit user account avatar', done => {
                request
                    .post('/image/avatar')
                    .attach('avatar', `${__dirname}/../../fixtures/200x100.png`)
                    // .attach('avatar', `${__dirname}/../../fixtures/200x100.png`)
                    // .attach('avatar', `${__dirname}/../../fixtures/440x320.png`)
                    // .attach('avatar', `${__dirname}/../../fixtures/exif.jpg`)
                    // .attach('avatar', `${__dirname}/../../fixtures/huge.jpg`)
                    // .attach('avatar', `${__dirname}/../../fixtures/small.jpg`)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        done();
                    });
            });
        });

        describe('Chat', () => {
            let RECIPIENT_ID;

            it('should get conversations list with first message for each other', done => {
                request
                    .get('/chat')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        return done();
                    });
            });

        //     describe('Sockets', () => {
        //         const socketURL = 'http://localhost:3000/chat';
        //
        //         const client = io.connect(socketURL);
        //
        //         let SOCKET_CONVERSATION_ID;
        //
        //         it('Should create conversation', function(done) {
        //             const conversation = {
        //                 recipientId: RECIPIENT_ID,
        //                 authorId:    AUTHOR_ID
        //             };
        //
        //             client.emit('enter conversation', conversation);
        //             client.on('enter conversation', data => {
        //                 SOCKET_CONVERSATION_ID = data.conversationId;
        //                 done();
        //             });
        //         });
        //
        //         it('Should send message', function(done) {
        //             const conversation = {
        //                 recipientId:    RECIPIENT_ID,
        //                 authorId:       AUTHOR_ID,
        //                 conversationId: SOCKET_CONVERSATION_ID,
        //                 message:        Faker.lorem.sentence()
        //             };
        //
        //             client.emit('new message', conversation);
        //             client.on('new message', data => {
        //                 done();
        //             });
        //         });
        //
        //         it('Should broadcast conversationsList', function(done) {
        //             client.emit('conversation list', AUTHOR_ID);
        //             client.on('conversation list', data => {
        //                 done();
        //             });
        //         });
        //     });
        });

        describe('Logging out', () => {
            it('should log out current user', done => {
                request
                    .get('/account/logout')
                    .expect(302)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        done();
                    });
            });
        });
    });
}
