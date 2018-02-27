
// What's going on?

// There is a background script with callbacks for certain events
// like switching tabs, creating a new tab, refreshing page, etc.

// When one of these events occurs background script messages a
// contents script asking for the theme-color.

// The content script retrieves content of the "theme-color" meta 
// tag (a hex color) and sends it back to the background script.

// When the background script receives a messages it builds a theme
// from that color and updates the browser theme. Yay!

// For pages without theme-color the content script will return null
// In these cases background script uses the default browser theme.

// Pages like blank-tab or settings do not run content scripts so 
// attempting to message the content script will return error.
// In this case also reset to default browser theme.

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions

function setTheme(theme_color, updated_tab) {
  // set theme
  if (theme_color === null) {
    // Site has no theme-color reset to default theme
    browser.theme.reset()
  }
  else {
    if (theme_color === "#ffffff") {
      textcolor = '#000'
    }
    else {
      textcolor = '#fff'
    }
    // Build theme from website theme_color
    theme = {
      images: {
        headerURL: '',
      },
      colors: {
        accentcolor: '#202340',
        textcolor: textcolor,
        toolbar: theme_color,
        toolbar_bottom_separator: theme_color,
      }
    }

    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];
      console.log(currentTab.id)
      if (currentTab.id === updated_tab.id) { // Sanity check
        browser.theme.update(theme);
      }
      else {
      }
    });



  }
}

// When message with theme-color is recieved from content script
function gotMessage(message, sender, sendResponse) {

  var theme_color = message.theme_color
  var updated_tab = sender.tab

  setTheme(theme_color, updated_tab);
}

// Ping content script
function update(activeInfo) {
  rsp = browser.tabs.sendMessage(activeInfo.tabId, "msg");
}

// Reset to default browser theme
function reset() {
  browser.theme.reset()
}

// When message is recieved, set theme
browser.runtime.onMessage.addListener(gotMessage);

// Whenever tab switches or changes pages, get update 
browser.tabs.onActivated.addListener(update);
// browser.webNavigation.onCompleted.addListener(update);
browser.webNavigation.onDOMContentLoaded.addListener(update);
// browser.windows.onFocusChanged.addListener(update)
browser.tabs.onCreated.addListener(reset)