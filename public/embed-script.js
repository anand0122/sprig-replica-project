(function() {
  'use strict';

  // FormPulse Embed Script
  window.FormPulseEmbed = {
    version: '1.0.0',
    
    init: function(options) {
      if (!options || !options.formId || !options.container) {
        console.error('FormPulseEmbed: formId and container are required');
        return;
      }

      const config = {
        formId: options.formId,
        container: options.container,
        theme: options.theme || 'light',
        showTitle: options.showTitle !== false,
        showDescription: options.showDescription !== false,
        primaryColor: options.primaryColor || '#3b82f6',
        backgroundColor: options.backgroundColor || '#ffffff',
        borderRadius: options.borderRadius || '8px',
        width: options.width || '100%',
        height: options.height || '600px',
        onSubmit: options.onSubmit || function() {},
        onLoad: options.onLoad || function() {},
        onError: options.onError || function() {}
      };

      this.createEmbed(config);
    },

    createEmbed: function(config) {
      const container = document.querySelector(config.container);
      if (!container) {
        console.error('FormPulseEmbed: Container not found:', config.container);
        return;
      }

      // Create iframe
      const iframe = document.createElement('iframe');
      const baseUrl = this.getBaseUrl();
      const params = new URLSearchParams({
        theme: config.theme,
        showTitle: config.showTitle.toString(),
        showDescription: config.showDescription.toString(),
        primaryColor: config.primaryColor.replace('#', ''),
        backgroundColor: config.backgroundColor.replace('#', ''),
        embed: 'true'
      });

      iframe.src = `${baseUrl}/embed/${config.formId}?${params.toString()}`;
      iframe.width = config.width;
      iframe.height = config.height;
      iframe.frameBorder = '0';
      iframe.style.cssText = `
        border: none;
        border-radius: ${config.borderRadius};
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        max-width: 100%;
      `;

      // Add loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: ${config.height};
          background-color: ${config.backgroundColor};
          border-radius: ${config.borderRadius};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #666;
        ">
          <div style="text-align: center;">
            <div style="
              width: 32px;
              height: 32px;
              border: 3px solid #f3f3f3;
              border-top: 3px solid ${config.primaryColor};
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto 12px;
            "></div>
            <div>Loading form...</div>
          </div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;

      container.appendChild(loadingDiv);

      // Handle iframe load
      iframe.onload = function() {
        container.removeChild(loadingDiv);
        container.appendChild(iframe);
        config.onLoad();
      };

      iframe.onerror = function() {
        container.removeChild(loadingDiv);
        container.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: ${config.height};
            background-color: #fee;
            border: 1px solid #fcc;
            border-radius: ${config.borderRadius};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #c33;
          ">
            <div style="text-align: center;">
              <div style="font-size: 18px; margin-bottom: 8px;">⚠️</div>
              <div>Failed to load form</div>
              <div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">
                Please check your form ID and try again
              </div>
            </div>
          </div>
        `;
        config.onError('Failed to load form');
      };

      // Listen for messages from iframe
      window.addEventListener('message', function(event) {
        if (event.origin !== baseUrl) return;
        
        if (event.data.type === 'formSubmit' && event.data.formId === config.formId) {
          config.onSubmit(event.data.data);
        }
        
        if (event.data.type === 'formResize' && event.data.formId === config.formId) {
          iframe.height = event.data.height + 'px';
        }
      });
    },

    getBaseUrl: function() {
      // Try to detect the base URL from the script tag
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src;
        if (src && src.includes('embed-script.js')) {
          return src.replace('/embed-script.js', '');
        }
      }
      
      // Fallback - this should be configured for production
      return window.location.protocol + '//' + window.location.host;
    },

    // Utility method to create multiple embeds
    initMultiple: function(embedConfigs) {
      embedConfigs.forEach(config => this.init(config));
    },

    // Method to destroy an embed
    destroy: function(container) {
      const element = document.querySelector(container);
      if (element) {
        element.innerHTML = '';
      }
    }
  };

  // Auto-initialize if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    const autoEmbeds = document.querySelectorAll('[data-formpulse-form]');
    autoEmbeds.forEach(function(element) {
      const formId = element.getAttribute('data-formpulse-form');
      const theme = element.getAttribute('data-theme') || 'light';
      const showTitle = element.getAttribute('data-show-title') !== 'false';
      const showDescription = element.getAttribute('data-show-description') !== 'false';
      const primaryColor = element.getAttribute('data-primary-color') || '#3b82f6';
      const backgroundColor = element.getAttribute('data-background-color') || '#ffffff';
      const borderRadius = element.getAttribute('data-border-radius') || '8px';
      const width = element.getAttribute('data-width') || '100%';
      const height = element.getAttribute('data-height') || '600px';

      // Create a unique container ID
      const containerId = 'formpulse-embed-' + Math.random().toString(36).substr(2, 9);
      element.id = containerId;

      window.FormPulseEmbed.init({
        formId: formId,
        container: '#' + containerId,
        theme: theme,
        showTitle: showTitle,
        showDescription: showDescription,
        primaryColor: primaryColor,
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
        width: width,
        height: height,
        onSubmit: function(data) {
          // Trigger custom event
          const event = new CustomEvent('formpulseSubmit', { 
            detail: { formId: formId, data: data } 
          });
          element.dispatchEvent(event);
        }
      });
    });
  });

})(); 