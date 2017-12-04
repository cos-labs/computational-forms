import DS from 'ember-data';
import ENV from '../config/environment';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend({

    session: Ember.inject.service(),

    // Polyfill queryRecord
    queryRecord(store, type, query) {
        const url = `${this.buildURL(type.modelName, null, null, 'queryRecord', query)}/`;

        if (this.sortQueryParams) {
            query = this.sortQueryParams(query);
        }

        return this.ajax(url, 'GET', { data: query })
            .then(function(result) {
                result = result.data;
                // hack to fix https://github.com/emberjs/data/issues/3790
                // and https://github.com/emberjs/data/pull/3866
                try {
                    store.push({ data: null });
                    return { data: result || null };
                } catch (e) {
                    return { data: result || [] };
                }
            }, function(result) {
                return {
                    data: null
                };
            });
    },

    ajax(url, method, hash) {
        hash = hash || {};
        hash.crossOrigin = true;
        hash.xhrFields = { withCredentials: true };
        hash.headers = hash.headers || {};
        hash.headers['X-CSRFTOKEN'] = this.get('session.data.authenticated.csrfToken');
        return this._super(url, method, hash);
    },

    buildURL(type, id) {
        const base = this._super(...arguments);
        const url = `${ENV.APP.apiURL}${base}`;
        console.log(url);
        return url;
    }

});
