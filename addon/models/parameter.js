import DS from 'ember-data';

const {
    Model,
    attr,
    hasMany,
    belongsTo
} = DS;

export default Model.extend({

    name: attr('string'),
    value: attr(),
    properties: attr(), // Property hash to store additional information about a parameter.

    aliases: hasMany('parameter-aliases', {
        inverse: 'parameters'
    }),

    cases: hasMany('case', {
        inverse: 'parameters'
    }),

    workflow: belongsTo('workflow', {
        inverse: 'parameters'
    }),

    stub: belongsTo('parameter-stub', {
        inverse: 'parameters'
    }),

    disableAutosave: false,

    autoSave: Ember.observer('currentState.isDirty', function() {
        Ember.run.debounce(() => {
            this.get('currentState.isDirty') &&
            !this.disableAutosave &&
            this.save();
        }, 1000);
    })

});
