import DS from 'ember-data';

const {
    Model,
    attr,
    belongsTo,
    hasMany
} = DS;

export default Model.extend({

    alias: attr('string'),

    widget: belongsTo('widget', {
        inverse: 'parameterAliases',
    }),

    cases: hasMany('case', {
        inverse: 'parameterAliases'
    }),

    workflow: belongsTo('workflow', {
        inverse: 'parameterAliases'
    }),

    parameters: hasMany('parameter', {
        inverse: 'aliases'
    }),

    parameterStub: belongsTo('parameter-stub', {
        inverse: 'aliases'
    })

});
