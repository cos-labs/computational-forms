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

    caxe: Ember.inject.service(),

    label: attr('string'),
    description: attr('string'),
    widgetType: attr('string'),
    defaultValue: attr('string'),
    index: attr('number'),
    parameterAliases: hasMany('parameter-alias', {
        inverse: 'widget',
        async: false
    }),

    workflow: belongsTo('workflow', {
        inverse: 'widgets'
    }),

    section: belongsTo('section', {
        inverse: 'widgets'
    }),

    caseParameters: Ember.computed('caxe.activeCase.parameters.@each', function() {
        const activeCase = this.get('caxe.activeCase');
        if (activeCase) {
            const aliases = this.get('parameterAliases');
            const caseParams = aliases.reduce((case_parameters, alias) => {
                const key = alias.get('alias');
                const value = activeCase.get('parameters').find(p => p.get('stub.id') === alias.get('parameterStub.id'));
                return Object.assign({ [key]: value }, case_parameters);
            }, {});
            return caseParams;
        }
        return {};
    })

});
