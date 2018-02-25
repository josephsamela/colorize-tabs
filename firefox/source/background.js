
// Mozilla extension documentation
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions

function setTheme(theme_color) {
  // Build theme from website theme_color
  theme = {
    images: {
      headerURL: '',
    },
    colors: {
      accentcolor: '#202340',
      textcolor: '#fff',
      toolbar: theme_color,
      toolbar_field_separator: theme_color,
      toolbar_field_border: theme_color,
      toolbar_bottom_separator: theme_color,
    }
  }
  // set theme
  if (theme_color === null) {
    browser.theme.reset()
  } else {
    browser.theme.update(theme);
  }
}

function gotMessage(message, sender, sendResponse) {
  console.log(message.theme_color);
  setTheme(message.theme_color);
}


// When message is recieved, set theme
browser.runtime.onMessage.addListener(gotMessage);


// Ping content script
function update(activeInfo) {
  browser.tabs.sendMessage(activeInfo.tabId, "msg");
}

function newtab() {
  browser.theme.reset()
}

// Whenever tab switches or changes pages, get update 
browser.tabs.onActivated.addListener(update);
browser.webNavigation.onCompleted.addListener(update);
browser.tabs.onCreated.addListener(newtab)