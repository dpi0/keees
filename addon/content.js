// Content script to handle scrolling commands
browser.runtime.onMessage.addListener(function(message) {
    switch (message.command) {
        case "scroll-up":
            window.scrollBy(0, -100); // Scroll up by 100 pixels
            break;
        case "scroll-to-top":
            window.scrollTo(0, 0); // Scroll to top of page
            break;
        case "scroll-down":
            window.scrollBy(0, 100); // Scroll down by 100 pixels
            break;
        case "scroll-to-bottom":
            window.scrollTo(0, document.body.scrollHeight); // Scroll to bottom of page
            break;
        case "page-down":
            // Equivalent to PageDown key - scroll down by viewport height
            window.scrollBy(0, window.innerHeight * 0.9);
            break;
        case "page-up":
            // Equivalent to PageUp key - scroll up by viewport height
            window.scrollBy(0, -window.innerHeight * 0.9);
            break;
    }
});
