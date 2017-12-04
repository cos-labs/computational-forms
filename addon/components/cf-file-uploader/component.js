import Ember from 'ember';
// import ENV from 'analytics-dashboard/config/environment';

export default Ember.Component.extend({

    fileChosen: false,

    parameters: {},

    actions: {

        uploadFile(ev) {
            const reader = new FileReader();
            const fileHandle = ev.target.files[0];
            const filenameParts = ev.currentTarget.value.split('\\');
            const filename = filenameParts[filenameParts.length - 1];

            reader.onloadend = (ev) => {
                this.set('parameters.fileName.value', filename);
                this.set('fileChosen', true);
                const result = ev.target.result;
                this.set('parameters.fileData.value', result);
            };
            reader.readAsDataURL(fileHandle);
        }

    },

});
