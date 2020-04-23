# Quick start to PWA 

PWA is a relatively huge topic so while quick is in the title, that surely may not be the case when setting up (It wasn't for me!). So don't be discouraged if you don't complete this as quickly as you wanted to, nothing in life worth having comes quickly (or something like that). In addition to offline features we can make our app look like a native app for phones (Instagram is PWA bet you never noticed!). I will touch on that conceptually but the main focus here will be on offline use.

Sidenote: Most browsers support PWA just be careful if you or your audience is using Safari or IE (smh keep up Apple). That being said you should use Chrome, I am using Chrome so to get the most consistency please jump on the Chrome train at least for this guide!

### Let's start with the manifest.json

["The web app manifest is a JSON file that tells the browser about your Progressive Web App and how it should behave when installed on the user's desktop or mobile device. A typical manifest file includes the app name, the icons the app should use, and the URL that should be opened when the app is launched."](https://web.dev/add-manifest/ "The first reading in the list of sources also mentions this!")

There are a ton of cool things this file can do for us for example<sup>1</sup>:

- ```display``` in its own window
- tell the page what page to open when the user visits it ```start_url```
- tell what ```orientation``` it should be in
- Lots more!

The manifest.json in this app just has a few icons for now, that's really all that's important for now








1: [Manifest page of the Codelabs resource](https://codelabs.developers.google.com/codelabs/your-first-pwapp/#3 "Citing resources my English teachers would be proud")

Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
