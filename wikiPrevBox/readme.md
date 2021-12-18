# Wikipedia preview box (summary)

Version 1.0.0, December 10, 2021, df

Automatically turns any link to a Wikipedia article on your website into a link with a nice preview box (article summary). Add one line of code and it works. Tried to make it as simple as possible so that everyone can use it.

## Example
Go to the [project page](https://su-pa.net/wikiPrevBox/) and ["Try it out"](https://su-pa.net/wikiPrevBox/).

## Features & characteristics
- Lightweight; only 116 lines of JavaScript, some CSS, a one character 'Wikipedia-W' font, a font and a bullet gif
- No installation needed: Insert one line of code and it works
- It's like magic, paste a link to a Wikipedia article in your content and the preview box just pops up!
- Works with touch & mouse, on mobile & desktop
- Preview box finds automatically the best place to display on mobile & desktop, landscape & portrait mode
- Wikipedia links with a preview box (summary) are nicely marked by a small Wikipedia logo that is made by a 1-char-font (!W:)
- Works with all languages, different text directions (ltr & rtl) and even mixed content/preview boxes
- Also works with existing offsite link icons
- Integrated "auto hyphenation" (CSS) for all (available) languages
- Fine animation of the (flying:) preview boxes 
- Shows summery & image (if any) inside every preview box (default)\
Possible settings:
  - Show inside all preview boxes only the summary text, no images
  - ... as above, but nevertheless show the image for a specific Wikipedia link
  - No preview box for a specific link
  - Vary the width of the preview boxes
  - Set the color of the 'W' next to the Wikipedia link and others via CSS
- Easy to use settings
- Simple to use on any website, web app or to [integrate in WordPress](https://su-pa.net/wikiPrevBox/) (see "How to" on the project website) and other CMS
- Works in all modern browsers
- MIT license, open source

## How-to
After the following step(s), all links to a Wikipedia article on your website will automatically display a preview box with the article summary that pop up on mouseover or a fingertip.

### 1) Copy, paste & go!

``Add the following line of code to the bottom of your web page, that's all - nothing else is needed.``
```
<script src="https://su-pa.net/wikiPrevBox/wikiPreviewBox.min.js"></script>
```

### 2) Or alternatively, grab the code and host it yourself
``Copy the folder "wikiPrevBox" to the root of your website and insert the following line of code at the bottom of your web page. See the comments in the source files if you want to edit it. `` 
```
<script src="/wikiPrevBox/wikiPreviewBox.min.js"></script>
```
<br>

### **SETTINGS** (optional)
### **Affects all preview boxes** 
are part of the ```<script ...>```-tag; currently you can set two parameters:
>data-wikipreview="noimages"\
data-wikipreview="width=*value*"

**Example:**
```
<script data-wikipreview="noimages,width=250" src="..."></script>
```
- `noimages`  
If this value is set, only the summary texts and no images are shown; this can help to reduce traffic in places with poor network conditions; or show only the images you like (by using `#showimage` - see below).
- `width=...`  
 Width of the preview boxes, number of pixels, value between 200 and 400, default is 300.
 <br>
   
### **Affects a specific preview box** 
are part of a Wikipedia link; currently you can set two parameters:
>#nopreview\
#showimage

**Example:**
```
<a href="https://en.wikipedia.org/wiki/Lanyu#nopreview">Orchid Island</a>
```
- `#nopreview`  
Does not show the Wikipedia preview box for a given link, but resets it to a common link to a Wikipedia article.
- `#showimage`  
Set this, if you have used `noimages` in the `<script ...>` tag (see above) but still want to show a picture in a specific Wikipedia preview box. This gives you the ability to take control of when an image is displayed inside a preview box.
<br><br>

### **Customize via Stylesheet**
You can overwrite the CSS rules of the preview boxes in your own stylesheet, e.g.

`a.wikiLink::after {color: #212427 !important;}`		      /* *set the color of the 'W' next Wikipedia links, default is 'inherit'* \*/\
`a.wikiLink::after {font-size: 0.8em !important;}`		      /* *size of the 'W', default is 0.7em* \*/\
`a.wikiLink {color: darkgreen;}`		      /* *color of the Wikipedia link* \*/\

... override any CSS rules you like to do; use `!important` if  necessary; you will find all rules in the stylesheet **wikiPreviewBox.css**

## About & privacy
Get the information on the [project page](https://su-pa.net/wikiPrevBox/) 

## Future plans, ideas
- Offline/cache features, prevent doing same things twice (reduce electron travels:)
- Custom text lenght of (a specific) preview box(es)
- Simpler 'W' settings (color & size) without stylesheet 
- Portrait modus on mobile: show image next to the summary text
- ...

## How to support?
- Become a "The Horse" member! It doesn't cost you a nickel! :-)\
 <a href="https://su-pa.net/wikiPrevBox/?the-horse" target="_blank"  rel="noopener">See what this means</a> (project website)
- <a href="https://donate.wikimedia.org/" target="_blank"  rel="noopener">Make a donation</a> to the 
				<a href="https://en.wikipedia.org/wiki/Wikimedia_Foundation" target="_blank" rel="noopener">Wikimedia Foundation</a>

## License
MIT License\
su-pa.net &copy; 12/2021