import { format as dateFormat } from '../utils/date';
import pluralize                from '../utils/pluralize';

class ResponseManager {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    success(params = {}) {
        this.params = params;

        return this.setRes({
            page: {
                success:    true,
                status:     this.params.status,
                data:       this.params.data,
                functions:  this.params.functions
            },
            json: {
                success:    true,
                status:     this.params.status,
                data:       this.params.data
            }
        });
    }

    fail(params = {}) {
        this.params = params;
        return this.setRes({
            page: {
                success:    false,
                status:     this.params.status,
                errors:     this.params.errors,
                message:    this.params.message,
                data:       this.params.data,
                functions:  this.params.functions
            },
            json: {
                success:    false,
                status:     this.params.status,
                errors:     this.params.errors,
                message:    this.params.message,
                data:       this.params.data
            }
        });
    }

    get params() {
        return this._params;
    }

    set params(params) {
        const defaultParams = {
            status:         400,
            type:           'json',
            errors:         [],
            data:           {},
            functions:      {},
            template:       'error',
            message:        '',
            redirectUrl:    '/',
            redirectStatus: 301,
            needUser:       true
        };
        params = Object.assign(defaultParams, params);

        if (params.needUser) { params.data.user = this.req.user; }
        params.functions.dateFormat = dateFormat;
        params.functions.age        = pluralize(['year', 'year', 'years']);
        this._params = params;
    }

    setRes(data = {}) {
        const params = this.params;

        if (this.params.type === 'status')   { return this.res.sendStatus(params.status); }
        if (this.params.type === 'redirect') { return this.res.redirect(params.redirectStatus, params.redirectUrl); }

        if (this.params.type === 'page') { return this.res.status(params.status).render(params.template, data.page); }
        if (this.params.type === 'json') { return this.res.status(params.status).send(data.json); }

        if (this.params.type === 'both') {
            if (this.req.xhr) { return this.res.status(params.status).send(data.json); }
            return this.res.status(params.status).render(params.template, data.page);
        }
    }
}

export default ResponseManager;
