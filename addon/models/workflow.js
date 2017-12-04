import Ember from 'ember';
import DS from 'ember-data';

const {
    Model,
    attr,
    hasMany,
} = DS;

export default Model.extend({
    title: attr('string'),
    parameters: hasMany('parameter', {
        inverse: 'workflow'
    }),
    description: attr('string'),
    caseDescription: attr('string'),
    sortedSections: Ember.computed('sections.@each.index', 'sections.@each', 'sections', function() {
        return this.get('sections').sortBy('index');
    }),
    sections: hasMany('section', {
        inverse: null,
    }),
    actions: hasMany('action', {
        inverse: null,
    }),
    collectionWorkflows: hasMany('collection-workflow', {
        inverse: 'workflow',
    }),
    initialParameters: hasMany('parameter', {
        inverse: null,
    }),
    widgets: hasMany('widget', {
        inverse: 'workflow',
    }),
    parameterAliases: hasMany('parameter-alias', {
        inverse: 'workflow'
    }),
    collections: hasMany('collection', {
        inverse: 'workflows',
    }),
    cases: hasMany('case', {
        inverse: 'workflow',
    })
});
