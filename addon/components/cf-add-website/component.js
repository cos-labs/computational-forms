import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    urlTitle: '',
    urlAddress: '',
    urlDescription: '',
    urlSaveErrors: null,
    actions: {
        addWebsite () {
            const item = this.get('store').createRecord('item', {
                title: this.get('urlTitle'),
                type: 'website',
                metadata: this.get('urlDescription'),
                status: 'pending',
                url: this.get('urlAddress'),
                sourceId: this.get('urlAddress'),
                collection: this.get('model'),
            });
            item.save().then(() => {
                this.get('transition')('collection.browse', this.get('model.id'));
            }).catch((error) => {
                this.set('urlSaveErrors', error.errors);
            });
            this.clearInputs();
        },
    },
    clearInputs () {
        this.set('urlTitle', '');
        this.set('urlAddress', '');
        this.set('urlDescription', '');
    },
});
