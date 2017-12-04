import Ember from 'ember';


export default Ember.Component.extend({

    caxe: Ember.inject.service(),
    store: Ember.inject.service(),

    choiceObserver: Ember.observer('chosen', function() {
        Ember.run(async () => {
            const chosen = this.get('chosen');
            const caxe = await this.get('store').findRecord('case', this.get('caxe.activeCase.id'));
            const chosenParameter = await this.get('store').queryRecord('parameter', {
                name: chosen,
                case: caxe.id
            });

            this.get('parameters.choices.value').map(async (choiceName) => {
                let choice = await this.get('store').queryRecord('parameter', {
                    name: choiceName.parameter,
                    case: caxe.id
                });

                if (!choice) {
                    choice = this.get('store').createRecord('parameter');
                    const choiceCases = await choice.get('cases');
                    choiceCases.addObject(caxe);
                    const wf = await caxe.get('workflow');
                    choice.disableAutosave = true;
                    choice.set('workflow', wf);
                    choice.set('name', choiceName.parameter);
                }

                choice.set('value', choiceName.parameter === chosen);
            });
        });
    })

});

