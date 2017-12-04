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

    // Polyfill queryRecord
    queryRecord(store, type, query) {
        const url = `${this.buildURL(type.modelName, null, null, 'queryRecord', query)}/`;

        console.log(url);

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

    buildURL(type, id, snapshot, requestType, query) {
        const base = this._super(...arguments);
        const url = [];
        url.push(ENV.APP.apiURL);
        url.push(base);
        const builtUrl = url.join('');
        return builtUrl;
    }

});
