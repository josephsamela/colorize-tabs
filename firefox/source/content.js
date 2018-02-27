

// Get theme-color from meta tag in page header
function get_theme_color() {
    var element = document.querySelector('meta[name="theme-color"]');
    var theme_color = element && element.getAttribute("content");

    // If no theme-color look for MS equivelant
    if (theme_color === null) {
        var element = document.querySelector('meta[name="msapplication-navbutton-color"]');
        var theme_color = element && element.getAttribute("content");
    }
    // Again try for Apple's version
    if (theme_color === null) {
        var element = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        var theme_color = element && element.getAttribute("content");
    }

    console.log(theme_color)

    return theme_color
}

// Get theme_color, package into message and send to background script
function gotMessage() {
    var theme_color = get_theme_color()
    let msg = {
        "theme_color": theme_color,
    }
    browser.runtime.sendMessage(msg)
}

browser.runtime.onMessage.addListener(gotMessage)