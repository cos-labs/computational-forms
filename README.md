# Computational Forms

Dynamic, heavy-duty, customisable, computable forms.

## Overview

Computational Forms (CF) is an Ember library that provides a way to connect the fields and data in a form to composable functionality. This allows users to create highly flexible forms with a great amount of power and customization.

It allows users to build forms by creating a JSON object that describes how the form should look and behave. It also provides a Django application that allows the form's state to persist, so that it may be used across multiple machines and browsers, and so that permissions may be set on which of your users are allowed to complete certain forms.

Many forms require logic in addition to the data fields that exist in it. A simple example might be a requirement for a name field where the user types in their full name out, but an API requires a separate field for first and last.

## Example

### `form.json`

### `

## Example sans-JSON

For the adventurous; a quick example of CF without using the CF JSON form schema. This creates a form that asks for a book's title and author, and `POST`'s the data to a url as form data.

### `route.js`

In this example, we manually create parameters to use in the form.
    
    import Ember from "ember";
    
    export default Ember.route.extend({
    	model() {
        	this.store.createRecord("parameter", {
            	name: "title",
                value: undefined
            }).save();
            this.store.createRecord("parameter", {
            	name: "author",
                value: undefined
            }).save();
            this.store.createRecord("parameter", {
            	name: "submit-url",
                value: "http://example.com/submit"
            }).save();
            this.store.createRecord("parameter", {
            	name: "",
            }).save();
        }
    })

### `controller.js`
	
    export default Ember.Controller.extend({
        formComponents: [{
        	componentName: "text-field",
          	parameters: {
            	textFieldValue: "title"
            }  
        }, {
        	componentName: "text-field",
       		parameters: {
            	textFieldValue: "author"
            }
        }, {
        	componentName: "submit"
            parameters: {
            	url: { value: "http://example.com/submit/" },
                format: { value: "formdata" },
                data: { value: {
                	title: "title",
                    author: "author"
                }}
            }
        }]
    })

### `template.hbs`
    
	{{#each formComponents as |formComponent|}}
		{{component
        	formComponent.componentName
            parameters=formComponent.parameters
        }}
	{{/each}}

## Components

A key concept in CF is the use of Ember components. There are two types of components. One type of component provides form controls. The other type of component provides an operation.

Every component takes an argument named parameters. Typically the component helper is used, to allow the type of component that should be rendered to be stored as a string in a variable.

	{{component <componentName> parameters=<componentParameters>}}
    
The `parameters` argument is how values from other parts of the form are passed around in CF. The values that each component 

Each component will look for particular keys in `parameters` that  it is capable of using. For a `text-field` component



### Available Components

#### Text Field `text-field`

A `text-field` is a basic single line form control that allows a user to input a string.

##### Parameters

`label` : A string to use as a label for the input field

`textFieldValue` : The string value of the input field

##### Example

###### `route.js`
    
    import Ember from "ember";
    
    export default Ember.route.extend({
    	model() {
        	
        }
    })

###### `controller.js`

	import Ember from "ember";
	
    export default Ember.Controller.extend({
        formComponents: [{
        	componentName: "text-field",
          	parameters: {
            	textFieldValue: "title"
            }  
        }]
    })

###### `template.hbs`
    
	{{#each formComponents as |formComponent|}}
		{{component
        	formComponent.componentName
            parameters=formComponent.parameters
        }}
	{{/each}}
    
#### Text Area `text-area`

#### Radio Buttons `radio-buttons`

