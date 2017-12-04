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

    typeObserver: Ember.observer('widget.parameters', 'widget.parameters.type.value', function() {
        this.set('parameters.type', {
            value: 'meeting' }
        );
    }),
    titleObserver: Ember.observer('widget.parameters', 'widget.parameters.title.value', function() {
        this.set('parameters.title', this.get('widget.parameters.title'));
    }),
    statusObserver: Ember.observer('widget.parameters', 'widget.parameters.status.value', function() {
        this.set('parameters.status', this.get('widget.parameters.status'));
    }),
    collectionObserver: Ember.observer('widget.parameters', 'widget.parameters.collection.value', function() {
        this.set('parameters.collection', {
            value: this.get('collection')
        });
    }),
    categoryObserver: Ember.observer('widget.parameters', 'widget.parameters.category.value', function() {
        this.set('parameters.category', this.get('widget.parameters.category'));
    }),
    locationObserver: Ember.observer('widget.parameters', 'widget.parameters.location.value', function() {
        this.set('parameters.location', this.get('widget.parameters.location'));
    }),
    startTimeObserver: Ember.observer('widget.parameters', 'widget.parameters.startTime.value', function() {
        this.set('parameters.startTime', this.get('widget.parameters.startTime'));
    }),
    endTimeObserver: Ember.observer('widget.parameters', 'widget.parameters.endTime.value', function() {
        this.set('parameters.endTime', this.get('widget.parameters.endTime'));
    }),
    descriptionObserver: Ember.observer('widget.parameters', 'widget.parameters.description.value', function() {
        this.set('parameters.description', this.get('widget.parameters.description'));
    }),
    metadataObserver: Ember.observer('widget.parameters', 'widget.parameters.metadata.value', function() {
        this.set('parameters.metadata', this.get('widget.parameters.metadata'));
    }),
    nodeObserver: Ember.observer('widget.parameters', 'widget.parameters.node.value', function() {
        this.set('parameters.node', this.get('widget.parameters.node'));
    }),

    init() {
        this.set('parameters.type', {
            value: 'meeting' }
        );
        this.set('parameters.title', this.get('widget.parameters.title'));
        this.set('parameters.status', this.get('widget.parameters.status'));
        this.set('parameters.collection', {
            value: this.get('collection')
        });
        this.set('parameters.category', this.get('widget.parameters.category'));
        this.set('parameters.location', this.get('widget.parameters.location'));
        this.set('parameters.startTime', this.get('widget.parameters.startTime'));
        this.set('parameters.endTime', this.get('widget.parameters.endTime'));
        this.set('parameters.description', this.get('widget.parameters.description'));
        this.set('parameters.metadata', this.get('widget.parameters.metadata'));
        this.set('parameters.node', this.get('widget.parameters.node'));
        return this._super(...arguments);
    },

    actions: {
        async pressButton() {
            const item = this.get('store').createRecord('item');
            item.set('type', 'meeting');
            item.set('title', this.get('parameters.eventTitle.value'));
            //             item.set('type', 'event');
            item.set('status', 'none');
            item.set('collection', this.get('collection'));
            item.set('category', this.get('parameters.category.value'));
            item.set('location', this.get('parameters.location.value'));
            item.set('startTime', this.get('parameters.startTime.value'));
            item.set('endTime', this.get('parameters.endTime.value'));
            item.set('description', this.get('parameters.description.value'));

            // TODO: REPLACE THESE WITH REAL WIDGETS
            item.set('metadata', '{}');
            item.set('sourceId', '3hgm5');
            item.set('url', 'http://example.com');

            const node = this.get('widget.parameters.node.value');
            // const node = this.get('store').createRecord('node');
            // node.set('title', this.get('widget.parameters.title.value'));
            // node.set('category', 'communication');
            await node.save();

            const uri = `${ENV.OSF.waterbutlerUrl}v1/resources/${node.get('id')}/providers/osfstorage/?kind=file&name=${item.get('title')}&direct=true`;

            const xhr = new XMLHttpRequest();
            xhr.open('PUT', uri, true);
            xhr.withCredentials = false;
            xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);

            const deferred = Ember.RSVP.defer();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                    item.set('fileLink', JSON.parse(xhr.responseText).data.links.download);
                    item.save();
                }
            };

            xhr.send(this.get('widget.parameters.fileData.value'));
        },
    },

});
