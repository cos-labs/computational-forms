import Ember from 'ember';
import DS from 'ember-data';

const {
    Model,
    attr,
    belongsTo,
    hasMany
} = DS;

export default Model.extend({

    name: attr('string'),

    workflow: belongsTo('workflow', {
        inverse: null
    }),

    parameters: hasMany('parameter', {
        inverse: 'stub'
    }),

    cases: hasMany('case', {
        inverse: 'stubs',
    }),

    aliases: hasMany('parameter-alias', {
        inverse: 'parameterStub'
    }),


});
