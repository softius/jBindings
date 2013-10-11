jBindings
=========

jBindings allows you to follow changes to any JavaScript object. It monitors all object properties for any changes and runs a function (handler) when that occurs.

jBindings comes with a built-in jQuery integration.

Why using jBindings?
-------------------
The functionality is similar with `Object.watch` but there are some important differences:

  1. The object is passed to handler as a parameter, instead of just the property.
  2. Is is possible to link two properties of diffenent objects with each other. That is to copy the value of the first property to second object's property.

You can refer to instructions for further information.

Instructions
------------

Let's assume that we have the following model.

``` JAVASCRIPT
var User = {
  "id": "1",
  "username": "softius",
  "email": "softius@example.com",
  "fullname": "Iacovos Constantinou"
}
```

You can follow changes on any property, using the function `follow`. For instance:

``` JAVASCRIPT
// Follow obj User
User.follow(function(item) {
  console.log("A change occured to user "+ item.id)
})

// Change user email
User.email = "iacovos@example.com"    // This will log "A change made to user 1"
```

In a real app, you might want to update an HTML element like below:

``` JAVASCRIPT
User.follow(function(item) {
  $('h1.title').html(item.fullname)
})
```
It is also possible also to follow HTML Elements. This include changes in attributes values.

``` JAVASCRIPT
$('input#user-email').follow(function(item) {
  User.email = $(item).val()
});
```

If jQuery is not available you can use vanilla JavaScript, even for HTML elements

``` JAVASCRIPT
document.getElementById('user-email').follow(function(item) {
  User.email = item.value
});
```

Last, you can link two objects, in order to copy the value of one's property to second object's property. Hence, we can rewrite the above as below:

``` JAVASCRIPT
$('input#user-email').follow('value', User, 'email')
```

Examples
--------
Examples including integration with [handlebarsjs.com](handlebars.js) can be found under `examples` directory. 
