import DS from 'ember-data';
import ENV from '../config/environment';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend({
    session: Ember.inject.service(),
    ajax(url, method, hash) {
        hash = hash || {};
        hash.crossOrigin = true;
        hash.xhrFields = { withCredentials: true };
        hash.headers = hash.headers || {};
        hash.headers['X-CSRFTOKEN'] = this.get('session.data.authenticated.csrfToken');
        return this._super(url, method, hash);
    },
    buildURL() {
        const base = this._super(...arguments);
        return `${ENV.APP.apiURL}${base}`;
    },
});
