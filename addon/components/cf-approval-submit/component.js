import Ember from 'ember';
import ENV from '../../config/environment';

function getToken() {
    let token;
    const session = window.localStorage['ember_simple_auth-session'];
    if (session) {
        token = JSON.parse(session).authenticated;
        if ('attributes' in token) {
            return token.attributes.accessToken;
        }
        return token;
    }
}

export default Ember.Component.extend({

    store: Ember.inject.service(),

    buttonString: 'Save',
    disabled: false,
    description: 'Submit',

    parameters: {},

    init() {
        this.set('parameters.type', {
            value: 'meeting' }
        );
        return this._super(...arguments);
    },

    actions: {
        async pressButton() {
            const item = await this.get('store').findRecord('item', this.get('parameters.item.value'));
            item.set('location', this.get('parameters.eventRoom.value'));
            item.set('startTime', this.get('parameters.startDate.value'));
            item.set('endTime', this.get('parameters.endDate.value'));
            if (this.get('parameters.approve.value')) item.set('status', 'approved');
            if (this.get('parameters.deny.value')) item.set('status', 'denied');
            await item.save();
            this.get('router')
                .transitionTo(
                    'collections.collection.item',
                    this.get('collection').id,
                    item.id
                );
        },
    },

});
