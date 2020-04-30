# This is a work in progress!!

# Outline for Annotated Guide to PWA and service workers (using indexedDb) 

This is a guide intended to clarify PWA concepts. Intended for use by anyone who needs a more in depth look into how it all works! It is best to go through the [Quick Start Guide for IndexedDB](./quickStartIndexedDB/readme.md) first since indexedDB is super important in context to how we will set up offline features in this PWA.

## Overview: Quick Start Guide IndexedDB

To do list (I know very original) application which features all CRUD operations. Simply open [index.html](./quickStartIndexedDB/index.html) in your browser to see it in action. Open the browser dev tools and open the application tab to see the indexedDB stuff (should be under a db called ToDoList)

#### Here are some resuorces that helped me make the indexedDB guide:
- Thank you Joshua Bell from [Stackoverflow](https://stackoverflow.com/questions/61296252/failed-to-execute-put-on-idbobjectstore-the-transaction-has-finished "Updating was the hardest part!")
- I referenced this [Blog Post](https://itnext.io/indexeddb-your-second-step-towards-progressive-web-apps-pwa-dcbcd6cc2076 "Some typos in there but still good") a lot
- Nothing better than good old [documentation!](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB "I think I still used the blog more than this one")
- I recommend watching this [Youtube video](https://youtu.be/g4U5WRzHitM "I think I only referenced error syntax in this video") on 1.5x speed 

## PWA 

The [Quick Start Guide for PWA](./quickStartPWA/readme.md) will cover some basic functionality on enabling offline use. We will be using MongoDB/Mongoose and IndexedDB to make this happen! Before you go there though check out these resources below! I am an INTP (Myers-Briggs Personality type) so I really like to skim and absorb many resources before I make a judgement or decision on something. In this case I juxtaposed some resources in different formats (readings, videos etc) to see what stuck with me and made sense. These resources were the main resources I used to compile this guide. Everyone's different though so please take a gander at the resources that helped me! While my guide should help a bit, nothing beats a primary source! 

#### Here are some resuorces that helped me make this guide:

- For all you avid readers 
    - [here's some really good reading to deep dive into PWA](https://codelabs.developers.google.com/codelabs/your-first-pwapp/#0 "'It's like a movie but in my head!' -Sam Puckett from iCarly in that one episode IYKYK")
    - [Alternate to the above resource](https://developers.google.com/web/ilt/pwa/offline-quickstart "I like the Offline Quickstrart section!")
    - [Beautifully visual guide of a PWA cookbook](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#on-activate "Graphs and charts and arrows oh my!")

- For all of you who like videos [here's an overview of PWA](https://youtu.be/cmGr0RszHc8 "He's using a Wii remote for the slides I love it")

- More details on manifest.json [BTW they're in your react apps when you use boilerplate 👀](https://web.dev/add-manifest/ "It's okay I didn't know either")
- More details on [Service Worker!](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker "It's super new still get on those fundamental concepts!")