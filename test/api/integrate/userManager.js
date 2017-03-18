import chai             from 'chai';
import moment           from 'moment';
import UserManager      from '../../../src/server/manager/UserManager';
import PurchaseModel    from '../../../src/server/models/Purchase';
import * as utils       from '../../utils';
import purchaseTypes    from '../../../src/server/enums/purchaseType';

const expect = chai.expect;
const assert = chai.assert;

export default function() {

    describe('User manager', () => {

        describe('must have methods', () => {
            it('refill', ()=>{
                assert.isFunction(UserManager.refill);
            });
            it('writeOffCredits', ()=>{
                assert.isFunction(UserManager.writeOffCredits);
            });
            it('register', ()=>{
                assert.isFunction(UserManager.register);
            });
        });

        describe('validateBirthdate', () => {
            it('birthdate format must be like "DD/MM/YYYY"', () => {
                expect(UserManager.validateBirthdate('10/12/2012')).to.be.true;
                expect(UserManager.validateBirthdate('10-10-2010')).to.be.false;
                expect(UserManager.validateBirthdate('40/10/2010')).to.be.false;
                expect(UserManager.validateBirthdate('10/40/2010')).to.be.false;
                expect(UserManager.validateBirthdate('10/12/20100')).to.be.false;
            });
        });

        describe('prepareBirthdate', () => {
            /**
             * Must return an instance of Moment
             */
            it('call with valid params', () => {
                expect(UserManager.prepareBirthdate('10/12/2012')).to.be.an.instanceof(moment);
            });

            /**
             * Must return null
             */
            it('call with invalid params', () => {
                expect(UserManager.prepareBirthdate('32/12/2012')).to.be.null;
            });
        });

        describe('refill method', () => {

            it('valid params', async() => {
                let user = await utils.getFakeUser();
                const uid = user._id;
                const amountBefore = user.amount;

                await UserManager.refill(user, 50);
                await UserManager.refill(user, '50');
                user = await utils.getUserById(uid);
                assert.equal(user.amount, amountBefore + 100);
            });

            it('invalid params', async() => {
                let user = await utils.getFakeUser();

                await assert.isRejected(UserManager.refill(user, -100), Error);
                await assert.isRejected(UserManager.refill(user), Error);
                await assert.isRejected(UserManager.refill(null, 100), Error);
                await assert.isRejected(UserManager.refill(), Error);
            });

            it('should create purchase log record', async() => {

                let user = await utils.getFakeUser();
                const num = 119;

                await UserManager.refill(user, num);

                let purchase = await PurchaseModel
                    .findOne({
                        'type': purchaseTypes.REFILL,
                        'user': user.id,
                        'cost': num
                    })
                    .exec();

                expect(purchase).to.not.be.null;
            });
        });

        // describe('prepareModel', () => {
        //     it('return an instance of UserModel', () => {
        //
        //     });
        // });
    });
};
