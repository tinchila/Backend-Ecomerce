import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app.js';
import User from '../../dao/models/users.js';
import RecoveryToken from '../../dao/models/recoveryToken.js';

const should = chai.should();
chai.use(chaiHttp);

describe('Auth Routes', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await RecoveryToken.deleteMany({});
    });

    describe('/POST recover', () => {
        it('it should send a recovery email to a user', (done) => {
            const user = new User({ email: 'test@example.com', name: 'Test User' });
            user.save((err, user) => {
                chai.request(server)
                    .post('/recover')
                    .send({email: 'test@example.com'})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql('success');
                        res.body.should.have.property('message').eql('A password recovery link has been sent to your email address.');
                        done();
                    });
            });
        });

        it('it should return an error for a non-existent user email', (done) => {
            chai.request(server)
                .post('/recover')
                .send({email: 'nonexistent@example.com'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('error');
                    res.body.should.have.property('message').eql('User not found.');
                    done();
                });
        });
    });
});
