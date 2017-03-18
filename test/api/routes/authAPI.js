import chai        from 'chai';
import Faker       from 'faker';
import io          from 'socket.io-client';
import UserManager from '../../../src/server/manager/UserManager';

const expect = chai.expect;

Faker.locale = 'ru';

const email    = Faker.random.number(10000) + Faker.internet.email(Faker.name.firstName(), Faker.name.lastName());
const password = 'jbuhgSSShg74rrr';
const deviceFingerprint = '12345';

export default function testAccount(request) {
    let AUTHOR_ID;

    describe('Authentication with JSON Web Token (via API)', () => {
        describe('Registration', () => {
            it('should register fake user', done => {
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
        });

        let TOKEN;
        describe('Logging in', () => {
            it('should login as fake user', done => {
                request
                    .post('/account/login')
                    .set('X-Requested-With', 'XMLHttpRequest')
                    .send({ email, password, deviceFingerprint })
                    .expect(200)
                    .end(function(err, res) {
                        TOKEN = res.body.data.token.accessToken;
                        if (err) { return done(err); }
                        done();
                    });
            });
        });

        describe('User area', () => {
            // it('should show user info', done => {
            //     request
            //         .get('/account')
            //         .set({
            //             Authorization: TOKEN,
            //             'X-Requested-With': 'XMLHttpRequest'
            //         })
            //         .expect(200)
            //         .end(function(err, res) {
            //             console.log(err, res);
            //             if (err) { return done(err); }
            //             done();
            //         });
            // });

            it('should show my info', done => {
                request
                    .get('/account')
                    .set({
                        Authorization: TOKEN,
                        'X-Requested-With': 'XMLHttpRequest'
                    })
                    .expect(200)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        done();
                    });
            });
        });

        // describe('Edit user', () => {
        //     it('should edit user account name', done => {
        //         request
        //             .patch('/api/user/<id>')
        //             .send({ name: Faker.name.firstName() })
        //             .expect(200)
        //             .end(function(err, res) {
        //                 if (err) { return done(err); }
        //                 done();
        //             });
        //     });
        // });
        //

        describe('User birthdate update', () => {
            it('should edit user account', done => {
                request
                    .post('/account/update/data')
                    .set({
                        Authorization: TOKEN,
                        'X-Requested-With': 'XMLHttpRequest'
                    })
                    .send({
                        birthdate: '28/05/1997'
                    })
                    .expect(200)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        done();
                    });
            });
        });


        // describe('Chat', () => {
        //     let CONVERSATION_ID;
        //     let RECIPIENT_ID;
        //
        //     it('should create new message and new conversation', done => {
        //         UserManager.register({
        //             name:       Faker.name.firstName(),
        //             birthdate:  `01/01/${new Date().getFullYear() - Faker.random.number({ min: 18, max: 60 })}`,
        //             city:       Faker.random.number(175),
        //             email:      Faker.random.number(10000) + Faker.internet.email(Faker.name.firstName(), Faker.name.lastName()),
        //             password:   password,
        //             sex:        'male',
        //         }).then(recipient => {
        //             const message = Faker.lorem.sentence();
        //             RECIPIENT_ID = recipient._id;
        //             request
        //                 .post('/chat/create_message')
        //                 .set({
        //                     Authorization: TOKEN,
        //                     'X-Requested-With': 'XMLHttpRequest'
        //                 })
        //                 .send({
        //                     recipientId: RECIPIENT_ID,
        //                     message
        //                 })
        //                 .expect(200)
        //                 .end(function(err, res) {
        //                     CONVERSATION_ID = res.body.data.conversation;
        //                     if (err) { return done(err); }
        //                     return done();
        //                 });
        //         }).catch(err => {
        //             return done(err);
        //         });
        //     });
        //
        //     it('should get conversations list with first message for each other', done => {
        //         request
        //             .get('/chat')
        //             .set('X-Requested-With', 'XMLHttpRequest')
        //             .expect(200)
        //             .end(function(err, res) {
        //                 if (err) { return done(err); }
        //                 return done();
        //             });
        //     });
        //
        //     let MESSAGE_ID;
        //
        //     it('should get conversation by id', done => {
        //         request
        //             .get('/chat/' + CONVERSATION_ID)
        //             .set({
        //                 Authorization: TOKEN,
        //                 'X-Requested-With': 'XMLHttpRequest'
        //             })
        //             .expect(200)
        //             .end(function(err, res) {
        //                 MESSAGE_ID = res.body.data.conversation[0]._id;
        //                 if (err) { return done(err); }
        //                 return done();
        //             });
        //     });
        //
        //     it('should mark message as read', done => {
        //         request
        //             .patch('/chat/mark_as_read')
        //             .set({
        //                 Authorization: TOKEN,
        //                 'X-Requested-With': 'XMLHttpRequest'
        //             })
        //             .send({ conversationId: CONVERSATION_ID, messageId: MESSAGE_ID })
        //             .expect(200)
        //             .end(function(err, res) {
        //                 if (err) { return done(err); }
        //                 return done();
        //             });
        //     });
        //
        //     it('should mark all messages as read', done => {
        //         request
        //             .patch('/chat/mark_all_as_read')
        //             .set({
        //                 Authorization: TOKEN,
        //                 'X-Requested-With': 'XMLHttpRequest'
        //             })
        //             .send({ conversationId: CONVERSATION_ID })
        //             .expect(200)
        //             .end(function(err, res) {
        //                 if (err) { return done(err); }
        //                 return done();
        //             });
        //     });
        // });

        describe('Logging out', () => {
            it('should log out current user', done => {
                request
                    .get(`/account/logout?device_fingerprint=${deviceFingerprint}`)
                    .set({
                        Authorization: TOKEN,
                        'X-Requested-With': 'XMLHttpRequest'
                    })
                    .expect(200)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        done();
                    });
            });
        });
    });
}
