# Summary box for Wikipedia links
Version 1.1.1, November 11, 2023, df

## Introduction
The **«Summary box for Wikipedia links»** automatically turns any new and existing link to a Wikipedia article on your website into a link with a nice preview box containing the article summary!  
**Project page:** [«Summary box for Wikipedia links»](https://su-pa.net/wikiPrevBox/)   

**Some time ago**, MediaWiki came up with the wonderful idea of [Page Preview](https://www.mediawiki.org/wiki/Page_Previews), which shows a preview of a linked page on mouseover within the Wikipedia site. **We thought how nice it would be to have this feature for any website/web application that works in any browser and on any device, here it is!** Just add a line of code to add the feature to your website, it works on desktop & mobile.

## Table of Contents
- [Introduction](#introduction)
- [Update history](#update-history)
- [About this repository](#about-this-repository)
- [Examples](#examples)
- [Features & Characteristics](#features--characteristics)
- [How to](#how-to)
  - [1) Copy, paste & go!](#1-copy-paste--go)
  - [2) Grab the code and host it yourself](#2-grab-the-code-and-host-it-yourself)
  - [3) Use the WordPress plugin](#3-use-the-wordpress-plugin)
- [Settings](#settings)
  - [Parameters that affect all Summary Boxes](#parameters-that-affect-all-summary-boxes)
  - [Parameters which affect a specific Summary Box](#parameters-which-affect-a-specific-summary-box)
  - [Customize via Stylesheet](#customize-via-stylesheet)
- [Future plans, some ideas](#future-plans--some-ideas)
- [How to support](#how-to-support)
- [License & privacy](#license--privacy)
- [Contact](#contact)

## Update history
- **Version 1.1.1** (November 08, 2023)
  - Introduced new customizable parameters (``numberofchars=..., openlinkinsamewindow, nowikilinknote, #dontshowimage``)
  - Improved code refactoring
  - **New:** Also available as [WordPress plugin](https://supa.cyon.site/)!
- **Version 1.0.0** (December 10, 2021)
  - Initial release as "Wikipedia preview box"

If you already using "Copy, paste & go!" (see below), you don't need to do anything. And if you like, you can start using the new parameters!

## About this repository
This repository contains the [project website](https://su-pa.net/wikiPrevBox/) including all necessary files for self-hosting. After downloading and extracting the ZIP file, you will have a working example of the «Summary box for Wikipedia links» out of the box, no web server or installation required, just open the ``index.html`` file in your browser.

## Examples
1. [Check it out on the project page](https://su-pa.net/wikiPrevBox/)!  
2. Some websites that use the «Summary box for Wikipedia links»:  
[dontwastemy.energy](https://dontwastemy.energy/2023/05/23/video-games-and-the-environment-how-are-they-related), [lanyu.land](https://lanyu.land/european-tourists-perspective), [the-horse.education](https://the-horse.education/), [teachingweb.org](https://teachingweb.org/en/), [risikosicherheit.ch](https://risikosicherheit.ch/psychische-resilienz/)  

If you would like to have a link to your website/web application that uses the «Summary box for Wikipedia links», please let us know.

## Features & Characteristics
- Lightweight; only 4KB of JavaScript, some CSS, a single character 'Wikipedia-W' font, a font and a bullet gif
- Easy to use on **any website** and also available as a **[WordPress plugin](https://supa.cyon.site/)**
- Works on mobile & desktop, with touch & mouse
- Works in all (modern) browsers; if the feature does not work in a specific browser version or device, it remains a normal link (without the summary box)!
- It's like magic, just add a line of code to your site and on all the Wikipedia links on your website/web application a preview box pops up on mouse over or finger tab and the links are marked with a nice "Wiki-W"!
- The Preview box automatically finds the best place to display on mobile & desktop, landscape & portrait mode
- Wikipedia links with a summary box are nicely marked by a small Wikipedia logo that is made of a 1-char-font, the "Wiki-W"
- Works with all languages, different text directions (ltr & rtl) and even mixed content/preview boxes
- Works with existing offsite link icons
- Built-in "auto hyphenation" (CSS) for all (available) languages
- Fine animation of the summary boxes 
- Shows the summary text & the image (if any) of the linked Wikipedia article inside a preview box (by default)\
- Easy-to-use settings via parameters as part of the ``<script>`` tag (affects all preview boxes) or as part of the link url (affects a specific preview boxes)
- Some custom parameters: width of the preview box; number of characters in the summary text; font size; don't show (an) image(s) 
- Advanced: Customize all parts in the CSS
- License: From version 1.1.1. GPL v3 applies (formerly MIT), Open Source

# How to
**Here are three different ways to use the «Summary box for Wikipedia links».**
By following the steps below, all links to Wikipedia articles on your site will automatically display a nice preview box with the article summary that pops up on mouseover or fingertip.

## 1) Copy, paste & go!

**Add the following line of code** to the bottom of your page, just before the ``</body>`` tag or inside the ``<head>`` tag, and you're done!

	<script src="https://su-pa.net/wikiPrevBox/wikiPreviewBox.min.js" crossorigin="anonymous" defer></script>

You can skip ``defer`` if you place the code snippet at the bottom of your page.

**Alternatively**, you can add the following line of code with an integrity key (SHA-384). This will ensure that the file has never been tempered either on our server or in transit. However, after an update, you will still get the older version until you update the script tag to the latest version.

	<script src="https://su-pa.net/wikiPrevBox/wikiPreviewBox_111a.min.js" integrity="sha384-0TKu3VREUd2XU++gzMzf8pXa4AMv7+kIl4RXIQTVxGtht9SP4DLebjEQImHZJOdQ" crossorigin="anonymous" defer></script>

Note: This is the latest version, older versions are always kept.

## 2) Grab the code and host it yourself
Download this repository (it's a copy of the [project website](https://su-pa.net/wikiPrevBox)), copy the folder "wikiPrevBox" to the root of your website and add the following line of code at the very bottom of your website, just before the </body> tag or inside the <head> tag.  

```
<script src="/wikiPrevBox/wikiPreviewBox.min.js" defer></script>
```
You can skip ``defer`` if you place the code snippet at the bottom of your page. Please refer the comments in the source files if you are interested in how it works or if you want to customize the code.   

## 3) Use the WordPress plugin
If you have a website running WordPress, you can easily install the [WordPress plugin](https://supa.cyon.site/). 

# Settings 
## Parameters that affect all Summary Boxes 
The parameters are part of the ```<script ...>```-tag; currently you can set six parameters as part of the ```data-wikipreview``` attribute. All parameters are optional.

>data-wikipreview="noimages,width=*value*, ..."\
>... numberofchars, fontsize=*value*, openlinkinsamewindow, nowikilinknote

### Example
```
<script data-wikipreview="noimages,width=250,nowikilinknote,fontsize=1.1" src="..."></script>
```

### Available parameters
- `width=...`  
 Width of the preview boxes, number of pixels, value between 200 and 400, default is 300.
 - `numberofchars=...`  
 Number of characters of the summary text in the preview box, value between 100 and 600, default is 280. Note: Depending on the linked Wikipedia article, the number of characters displayed may be less than the number you've specified.
 - `fontsize=...`  
Font size, relative to the font size "around", value between 0.3 and 2 default is 0.9.
- `noimages`  
If this value is set, only the summary texts will be shown and no images; this can help to reduce traffic in places with poor network conditions; or you can display only the images that you like (by using `#showimage` - see below).
 - `openlinkinsamewindow`  
If set, the linked Wikipedia article in the preview box will be opened in the same window.
 - `nowikilinknote`  
If this value is set, the info url "(wikipedia.org)" next to the Wikipedia link in the preview box will be replaced with an arrow.
   
## Parameters which affect a specific Summary Box 
Add the parameter to the Wikipedia link URL; you can currently set three parameters:
>#nopreview\
#showimage\
#dontshowimage

### Example
```
<a href="https://en.wikipedia.org/wiki/Lanyu#nopreview">Orchid Island</a>
```
- `#nopreview`  
Does not show the Wikipedia preview box for a given link, but resets it to a common link to the Wikipedia article.
- `#showimage`  
Use this, if you have used the `noimages` parameter in the `<script ...>` tag (see above), but still want to show an image in a specific Wikipedia preview box. This allows you to control of when an image is displayed.
- `#dontshowimage`  
Do not show the image of a specific Wikipedia link.


### Customize via Stylesheet
Additionally, you can overwrite the CSS rules of the Summary Boxes in the stylesheet "wikiPreviewBox.css" (resp. "wikiPreviewBox.min.css" &ndash; be aware that the minified files (.min) are referenced), e.g.:  
`a.wikiLink::after {color: #212427 !important;}` /* *color of the 'Wiki-W', default is 'inherit'* \*/\
`a.wikiLink {color: darkgreen;}` /* *color of the Wikipedia link* \*/

Use `!important` if  necessary.

## Future plans & some ideas
- In some cases: Automatically hide the summary box after a while
- (Portrait modus on mobile: display image next to the summary text)
- Enlarge image after tap/click on an image
- Button to show more summary text  
- Offline and cache features
- Letter 'W' custom settings

## How to support
We would be delighted if you would support **«The Horse project»**!\
We are a non-profit association for the promotion of intercultural youth projects, since 2016.
- Website of our organisation: [«THE ! association»](https://the-horse.education)
- Realised cross-border projects of the young people: [dontwastemy.energy](https://dontwastemy.energy)
- [Donate The Horse!](https://donate.stripe.com/aEU01Rfj55RxdO0cMO) (stripe.com)

Or [donate](https://donate.wikimedia.org) to the 
	[Wikimedia Foundation](https://en.wikipedia.org/wiki/Wikimedia_Foundation).

## License & privacy
Privacy: Get more information on the [project page](https://su-pa.net/wikiPrevBox/).  
License: [GPL v3 License](https://www.gnu.org/licenses/gpl-3.0.en.html)

## Contact
**Nothing is perfect!** I'm not nothing.\
Please don't hesitate to reach out if you need assistance or have suggestions.\
Dominik Fehr, wikinick@su-pa.net 

[«Summary box for Wikipedia links» project page](https://su-pa.net/wikiPrevBox/)  
[«Summary box for Wikipedia links» WordPress plugin](https://supa.cyon.site/)   
df, [su-pa.net](https://su-pa.net) &copy; 11/2023