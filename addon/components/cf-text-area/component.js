import Ember from 'ember';


export default Ember.Component.extend({

    editing: true,

    description: 'Enter a title for the preprint.',

    didReceiveAttrs() {
        this.set('description', this.attrs.description);
    },

});
