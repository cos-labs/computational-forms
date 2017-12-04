import Ember from 'ember';
import DS from 'ember-data';


const {
    computed,
} = Ember;

const {
    Model,
    attr,
    belongsTo,
    hasMany
} = DS;


export default Model.extend({

    workflow: belongsTo('workflow', {
        inverse: 'cases'
    }),

    sections: hasMany('section', {
        async: false,
        inverse: null
    }),

    widgets: hasMany('widget', {
        inverse: null,
        async: false
    }),

    parameterAliases: hasMany('parameter-alias', {
        inverse: 'cases',
        async: false
    }),

    parameters: hasMany('parameter', {
        inverse: 'cases',
        async: false
    }),

    stubs: hasMany('parameter-stub', {
        inverse: 'cases',
        async: false
    }),

    collection: belongsTo('collection', {
        inverse: null,
        async: true
    })

});
