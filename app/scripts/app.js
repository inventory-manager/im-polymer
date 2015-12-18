/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Sets app default base URL
  app.baseUrl = '/';
  app.apiUrl = window.location.port === '' ? '/' : 'http://localhost:8000/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

  app.validatedSubmit = function(form) {
    var isValid = true;
    var children = Array.prototype.slice.call(form.children);
    children.forEach(function(child) {
      if (typeof child.validate === 'function') {
        isValid = child.validate() && isValid;
      }
    });
    if (isValid) {
      form.submit();
    }
  };

  app.clearFormValues = function(form) {
    var children = Array.prototype.slice.call(form.children);
    children.forEach(function(child) {
      if ('value' in child) {
        child.value = '';
      }
    });
  };

  app.applyGenericFormListeners = function(form, submitButton, successCondition, successMsg,
                                           failureMsg, successHandler, failureHandler) {
    submitButton.addEventListener('click', function() {
      app.validatedSubmit(form);
    });

    form.addEventListener('submitted', function(event) {
      var jsonResponse = JSON.parse(event.detail.responseText);

      if (successCondition(event)) {
        if (successMsg) {
          app.$.toast.text = successMsg;
          app.$.toast.show();
        }

        if (typeof successHandler === 'function') {
          successHandler();
        }
      } else {
        if (failureMsg) {
          failureMsg = 'Es ist ein Fehler aufgetreten';
        }

        if (jsonResponse.hasOwnProperty('error')) {
          failureMsg += ': ' + jsonResponse.error;
        }
        app.$.toast.text = failureMsg;
        app.$.toast.show();

        if (typeof failureHandler === 'function') {
          failureHandler();
        }
      }
    });
  };
})(document);
