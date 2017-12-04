import Ember from 'ember';

// Helper function to determine if discipline has changed (comparing list of lists)
function disciplineArraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i].length !== b[i].length) return false;
        for (let j = 0; j < a[i].length; ++j) {
            if (a[i][j] !== b[i][j]) return false;
        }
    }
    return true;
}

function subjectIdMap(subjectArray) {
    // Maps array of arrays of disciplines into array of arrays of discipline ids.
    return subjectArray.map(subjectBlock => subjectBlock.map(subject => subject.id));
}

function arrayEquals(arr1, arr2) {
    return arr1.length === arr2.length
        && arr1.reduce((acc, val, i) => acc && val === arr2[i], true);
}

function arrayStartsWith(arr, prefix) {
    return prefix.reduce((acc, val, i) => acc && val && arr[i] && val.id === arr[i].id, true);
}
/**
 * @module ember-preprints
 * @submodule components
 */

/**
 * Add discipline when creating a preprint.
 *
 * Sample usage:
 * ```handlebars
 * {{subject-picker
 *      editMode=editMode
 *      selected=subjectList
 *      disciplineModifiedToggle=disciplineModifiedToggle
 *      save=(action 'setSubjects')
 *}}
 * ```
 * @class subject-picker
 */
export default Ember.Component.extend({
    store: Ember.inject.service(),
    theme: Ember.inject.service(),

    // Store the lists of subjects
    _tier1: null,
    _tier2: null,
    _tier3: null,
    // Filter the list of subjects if appropriate
    tier1FilterText: '',
    tier2FilterText: '',
    tier3FilterText: '',
    tierSorting: ['text:asc'], // eslint-disable-line ember/avoid-leaking-state-in-components
    // Currently selected subjects
    selection1: null,
    selection2: null,
    selection3: null,
    disciplineModifiedToggle: false,
    disciplineSaveState: false,
    editMode: false,

    disciplineValid: Ember.computed.notEmpty('selected'),

    tier1Sorted: Ember.computed.sort('tier1Filtered', 'tierSorting'),
    tier2Sorted: Ember.computed.sort('tier2Filtered', 'tierSorting'),
    tier3Sorted: Ember.computed.sort('tier3Filtered', 'tierSorting'),

    tier1Filtered: Ember.computed('tier1FilterText', '_tier1.[]', function() {
        const items = this.get('_tier1') || [];
        const filterText = this.get('tier1FilterText').toLowerCase();
        if (filterText) {
            return items.filter(item => item.get('text').toLowerCase().includes(filterText));
        }
        return items;
    }),

    tier2Filtered: Ember.computed('tier2FilterText', '_tier2.[]', function() {
        const items = this.get('_tier2') || [];
        const filterText = this.get('tier2FilterText').toLowerCase();
        if (filterText) {
            return items.filter(item => item.get('text').toLowerCase().includes(filterText));
        }
        return items;
    }),

    tier3Filtered: Ember.computed('tier3FilterText', '_tier3.[]', function() {
        const items = this.get('_tier3') || [];
        const filterText = this.get('tier3FilterText').toLowerCase();
        if (filterText) {
            return items.filter(item => item.get('text').toLowerCase().includes(filterText));
        }
        return items;
    }),

    // Pending subjects
    subjectsList: Ember.computed('subjects.@each', function() {
        return this.get('subjects') ? Ember.$.extend(true, [], this.get('subjects')) : Ember.A();
    }),

    // Flattened subject list
    disciplineReduced: Ember.computed('subjects', function() {
        return Ember.$.extend(true, [], this.get('subjects')).reduce((acc, val) => acc.concat(val), []).uniqBy('id');
    }),

    disciplineChanged: Ember.computed(
        'subjects.@each.subject',
        'selected.@each.subject',
        'disciplineModifiedToggle',
        function() {
            const changed = !(disciplineArraysEqual(subjectIdMap(this.get('subjects')), subjectIdMap(this.get('selected'))));
            this.set('isSectionSaved', !changed);
            return changed;
        }
    ),

    init() {
        this._super(...arguments);
        this.set('subjects', []);
        this.set('selected', this.get('subjectsList'));
        this.querySubjects();
    },

    actions: {
        deselect(subject) {
            let index;
            if (subject.length === 1) {
                index = 0;
            } else {
                const parent = subject.slice(0, -1);
                index = this.get('selected').findIndex(item => item !== subject && arrayStartsWith(item, parent));
            }

            let wipe = 4; // Tiers to clear
            if (index === -1) {
                if (this.get(`selection${subject.length}`) === subject[subject.length - 1]) wipe = subject.length + 1;
                subject.removeAt(subject.length - 1);
            } else {
                this.get('selected').removeAt(this.get('selected').indexOf(subject));
                for (let i = 2; i < 4; i++) {
                    if (this.get(`selection${i}`) !== subject[i - 1]) continue;
                    wipe = i;
                    break;
                }
            }

            for (let i = wipe; i < 4; i++) {
                this.set(`_tier${i}`, null);
                this.set(`selection${i}`, null);
            }
            this.setSubjects(this.get('selected'));
        },
        select(selected, tier) {
            tier = parseInt(tier, 10);
            if (this.get(`selection${tier}`) === selected) return;

            this.set(`selection${tier}`, selected);

            // Inserting the subject lol
            let index = -1;
            const selection = [...Array(tier).keys()].map(index => this.get(`selection${index + 1}`));

            // An existing tag has this prefix, and this is the lowest level of the taxonomy,
            // so no need to fetch child results
            if (!(tier !== 3 && this.get('selected').findIndex(item => arrayStartsWith(item, selection)) !== -1)) {
                for (let i = 0; i < selection.length; i++) {
                    const sub = selection.slice(0, i + 1);
                    // "deep" equals
                    index = this.get('selected').findIndex(item => arrayEquals(item, sub)); // jshint ignore:line

                    if (index === -1) continue;

                    this.get('selected')[index].pushObjects(selection.slice(i + 1));
                    break;
                }

                if (index === -1) { this.get('selected').pushObject(selection); }
            }

            this.setSubjects(this.get('selected'));

            if (tier === 3) return;

            for (let i = tier + 1; i < 4; i++) { this.set(`_tier${i}`, null); }

            // TODO: Fires a network request every time clicking here, instead of only when needed?
            this.querySubjects(selected.id, tier);
        },
        discardSubjects() {
            // Discards changes to subjects. (No requests sent, front-end only.)
            this.set('selected', Ember.$.extend(true, [], this.get('subjects')));
        },
        saveSubjects() {
            const subjectMap = Ember.$.extend(true, [], this.get('selected'));
            this.get('action')(this).then(() => {
                this.attrs.saveParameter(this.attrs.widget.value.parameters.subjects, {
                    value: subjectMap,
                    state: ['defined'],
                });
                // Update subjects with selected subjects
                this.set('subjects', Ember.$.extend(true, [], subjectMap));
                this.set('editMode', false);
                // Prevent closing the section until it is valid
                if (!this.get('disciplineChanged')) {
                    this.sendAction('closeSection', this.get('name'));
                }
            });
        },
    },
    querySubjects(parents = 'null', tier = 0) {
        this.get('theme.provider')
            .then(provider => provider
                .query('taxonomies', {
                    filter: {
                        parents,
                    },
                    page: {
                        size: 100,
                    },
                }),
            )
            .then(results => this
                .set(`_tier${tier + 1}`, results.toArray()),
            );
    },

    setSubjects(subjects) {
        // Sets selected with pending subjects. Does not save.
        const disciplineModifiedToggle = this.get('disciplineModifiedToggle');
        // Need to observe if discipline in nested array has changed.
        // Toggling this will force 'disciplineChanged' to be recalculated
        this.set('disciplineModifiedToggle', !disciplineModifiedToggle);
        this.set('selected', subjects);
    },
});
