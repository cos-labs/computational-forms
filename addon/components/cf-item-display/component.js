import Ember from 'ember';


export default Ember.Component.extend({

    store: Ember.inject.service(),

    editing: true,
    description: 'Enter a title for the preprint.',

    classNames: ['item-display'],

    item: undefined,

    didReceiveAttrs() {
        this.set('description', this.attrs.description);
        this.get('store')
            .findRecord('item', this.get('parameters.value.value'))
            .then((item) => {
                this.set('item', item);
            });
    },

});
