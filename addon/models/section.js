import Ember from 'ember';
import DS from 'ember-data';

const {
    computed
} = Ember;

const {
    Model,
    attr,
    hasMany,
} = DS;

export default Model.extend({
    label: attr('string'),
    description: attr('string'),
    index: attr('number'),
    widgets: hasMany('widget', {
        inverse: 'section'
    }),
    sortedWidgets: Ember.computed('widgets.@each.index', function() {
        return this.get('widgets').sortBy('index');
    }),
    divId: computed('label', function() {
        return this.get('label').dasherize();
    }),
});
