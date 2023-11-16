/*!
 * Project: Summary Box for Wikipedia links (formerly Wikipedia preview boxes)
 * Version: 1.1.1 (Released: 04.11.2023) | Initial Release: 1.0.0 (12.10.2021)
 * License: GPL v3 (Current) | MIT (Initial)
 * Availability: Standalone; also available as a WordPress plugin, see project page
 * Project Page: https://su-pa.net/wikiPrevBox/
 * Author: Dominik Fehr, wikinick@su-pa.net, su-pa.net
 * Description: Turns Wikipedia links into links that show nice summary preview boxes.
 */

//#region wikipedia preview boxes
(function() {
    "use strict";

    //#region * DIFFERENCES BETWEEN THE 3 VERSIONS (all other code is equal in all versions)
    // 1) copy, past & go! 2) self hosting 3) WordPress (WP) plugin (=> CSS path is in PHP file)
    
    //path to the CSS file
    //let CSS_PATH = "https://su-pa.net/wikiPrevBox/wikiPreviewBox.min.css"; //copy, past & go! 
    let CSS_PATH   = "wikiPrevBox/wikiPreviewBox.min.css";                  //self hosting
    document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', '<link rel="stylesheet" type="text/css" href="' + CSS_PATH + '">'); //self hosting 
    
    //show summary box always on very top
    //let ZINDEXOFBOX = 1111; //WP plugin, why 1111? => (dato) our WP plugin can be used together with WikiMedia plugin "Wikipedia Preview" and they use zIndex "1100", make sure that the summary box on smartphone shows over the modal window from WikiMedia plugin  
    let ZINDEXOFBOX = 1;      //For all websites & self hosting
    //#endregion DIFFERENCES

    //#region summary box general settings 
    //add an empty wiki-preview-box container, everything happens inside here
    document.body.insertAdjacentHTML('afterbegin', '<article id="wikiPreviewBox" class="wikiPreviewBox"></article>');

    //settings: affecting all preview/summary boxes 
    //set default values
    let showNoImages = false;                   //show preview images from Wikipedia in the summary boxes (if there is one)
    let openLinkTarget = "target='_blank'";     //open Wikipedia link in a new window
    let wikiBoxWidth = 300;                     //summary box width; default=300, min=200, max=400
    let wikiBoxMaxLenght = 280;                 //max. number of chars: default=280, min=100, max=600 in a summary box; (note: 1. can be shorter, depends also from the Wikipedia-summary-text-lenght; 2. includes some HTML tags (~15 chars ... <p><b>... // on disambiguation terms: additional <ul><li>...</li>...</ul>)
    let wikiBoxFontSize = 0.9;                  //inherited font size, in relation to the font-size "around" the summary box
    let showWikipediaOrg = true;                //(don't) show info url "(wikipedia.org)", beside the Wikipedia link inside the preview box
    let strWikipediaOrg = "</a> (wikipedia.org)";   //info url, placed beside the Wikipedia link inside the preview box
    let textDirection = document.dir || "";     //website text direction if set (<html ... dir="rtl">)
    
    // extract optional custom setting values (affecting all boxes), if any from e.g.:
    // <script data-wikipreview="noimages,width=250,..." src="... ></script>)
    // possible parameters, e.g.:  width=234, numberofchars=120, fontsize=0.8, noimages, openlinkinsamewindow, nowikilinknote
    if (typeof (document.currentScript.dataset.wikipreview) != "undefined") { //are there any custom settings?
        const strCustomParams = document.currentScript.dataset.wikipreview;
        const objCustomParams = strCustomParams.split(',').reduce((acc, item) => {
          const [key, value] = item.split('=');
          acc[key] = value === undefined ? true : isNaN(value) ? value : parseFloat(value);
          return acc;
        }, {});

        //if a value was set => update default value
        const { noimages, openlinkinsamewindow, width, numberofchars, fontsize, nowikilinknote } = objCustomParams;
        showNoImages = noimages || showNoImages;
        openLinkTarget = openlinkinsamewindow ? "" : openLinkTarget;
        wikiBoxWidth = Math.min(Math.max(parseInt(width || 300), 200), 400);
        wikiBoxMaxLenght = Math.min(Math.max(parseInt(numberofchars || 280), 100), 600);
        wikiBoxFontSize = Math.min(Math.max(parseFloat(fontsize || 0.9), 0.3), 2);
        showWikipediaOrg = nowikilinknote ? showWikipediaOrg = false : showWikipediaOrg;
    }

    let whatArticle = ""; //term to show (last part of the url to a wikipedia article)
    let wikiArticleUrl = "", wikiLang = "", wikiTermPos, wikiTerm;

    //set box basic styles as early as possible
    let wikiPreviewBox = document.getElementById("wikiPreviewBox");
    wikiPreviewBox.style.width = wikiBoxWidth + "px";
    wikiPreviewBox.style.fontSize = wikiBoxFontSize + "em";

    // *** get & set the highest z-index on the page; make sure the box is always on top of all other elements ***
    wikiPreviewBox.style.zIndex  = [...document.querySelectorAll`*`].reduce((a, e, i, t, z = +window.getComputedStyle(e).zIndex || 0) => z > a ? z : a, 0) + ZINDEXOFBOX;

    //add preview box events
    wikiPreviewBox.addEventListener("click", hideWikiBox);
    wikiPreviewBox.addEventListener("mouseover", showWikiBox);
    wikiPreviewBox.addEventListener("mouseout", hideWikiBox);
    //#endregion

    //#region catch & prepare Wikipedia links in page to display summary boxes  
    //get all wikipedia links except the once that have a "#nopreview" at the end
    let allWikiLinks = document.querySelectorAll("[href*='wikipedia.org']:not([href*='#nopreview'])");

    //clean the links with "#nopreview" at the end (remove it)
    let allWithNopreview = document.querySelectorAll("[href*='#nopreview']");
    for (let z = 0; z < allWithNopreview.length; z++) {
        allWithNopreview[z].href = allWithNopreview[z].href.replace('#nopreview','');
    }

    //make all Wikipedia links ready (for getting data, pos. the preview box, rtl) 
    for (let i = 0; i < allWikiLinks.length; i++) {        
        allWikiLinks[i].classList.add('wikiLink');
        if (textDirection==="rtl") {allWikiLinks[i].classList.add("wikiLink_rtl")} //if website direction is set (rtl) => beautify the Wikipedia links inside content

        allWikiLinks[i].addEventListener("mouseover", (e) => {
            wikiTerm = e.currentTarget;
            wikiArticleUrl = wikiTerm.href;
            whatArticle = "" + wikiArticleUrl.split("/").pop();     //get term     :: sun, sonne, energy, ...
            wikiLang = wikiArticleUrl.split(".")[0].split("//")[1]; //get language :: en, zh, de, ...

            //#region position "left<>right" of the wiki preview box
            wikiTermPos = wikiTerm.getBoundingClientRect();
            let wikiBoxLeft = wikiTermPos.left - (wikiBoxWidth / 2) + ((wikiTermPos.right - wikiTermPos.left) / 2);
            if (wikiBoxLeft < 0) { wikiBoxLeft = 10; } //do not pos. it out of the left edge                    

            //fix "is a little outside if window.innerWidth < preview-box"
            let winInnerWidth = window.innerWidth;
            if (winInnerWidth < wikiBoxWidth) { wikiBoxLeft = winInnerWidth - wikiBoxWidth + (wikiBoxWidth - winInnerWidth); }
            else {
                if ((wikiBoxLeft + wikiBoxWidth) > winInnerWidth) { wikiBoxLeft = winInnerWidth - wikiBoxWidth - 20; } //do not pos out right side
            }
            wikiPreviewBox.style.left = wikiBoxLeft + "px"; //maybe move this (all, not on a monday) to the function in the bottom
            //#endregion

            getWikiPreviewData(whatArticle, wikiLang);

        }, false);

        allWikiLinks[i].addEventListener('click', (event) => { event.preventDefault(); }); //don't open a link, just show the preview box
        allWikiLinks[i].addEventListener("mouseout", hideWikiBox);
    }
    //#endregion

    //#region sanitize API data from Wikipedia
    function sanitizeApiData(str) { //sanitizeHTML
        const allowedTags = ['b', 'i', 'p', 'strong', 'ul', 'li', 'img', 'span', 'a']; //allowed tags           
        return str.replace(/<\/?([a-zA-Z0-9]+)(\s+[^>]*)?>/g, (match, tagName) => { // replace not allowed tags with its escaped version
            tagName = tagName.toLowerCase();
            if (allowedTags.includes(tagName)) {return match;} // allowed tags
            return match.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // escape unwanted tags
        });
    }
    //#endregion

    //#region get data from wikipedia
    function getWikiPreviewData(whatArticle, whatLang = 'en') {
        whatArticle = (whatArticle.charAt(0).toUpperCase() + whatArticle.slice(1)).replace(/ /g, '_'); //be nice to wikipedia => make/ensure 1st letter is uppercase & transform blanks to underscores
        
        const showThisImgAnyway = whatArticle.includes('#showimage'); //hide all image is set; but show the img in this specific box
        if (showThisImgAnyway) { whatArticle = whatArticle.replace('#showimage','')}
        
        const dontShowThisImg = whatArticle.includes('#dontshowimage'); //show all images is set; but hide the img in this specific box
        if (dontShowThisImg) { whatArticle = whatArticle.replace('#dontshowimage','')}

        let arrArticleSummary = [];
        if (navigator.onLine) {
            fetch(`https://${whatLang}.m.wikipedia.org/api/rest_v1/page/summary/${whatArticle}`)
              .then(response => {
                if (response.ok) {
                  response.json().then(wikiSummData => {
                    //console.log(wikiSummData); //all available summary data from Wikipedia

                    //sanitize Wiki API data 
                    const sumTit  = sanitizeApiData(wikiSummData.title);
                    const sumHtml = sanitizeApiData(wikiSummData.extract_html);

                    const thumbnailSource = wikiSummData?.thumbnail?.source ?? '';
                    const thumbnailHeight = wikiSummData?.thumbnail?.height ?? 0;
                    if ((thumbnailSource !== '' && !showNoImages && !dontShowThisImg) || showThisImgAnyway) {
                        arrArticleSummary = [`<img height="${sanitizeApiData(thumbnailHeight.toString())}" src="${sanitizeApiData(thumbnailSource)}"/>`, sumHtml, `https://${whatLang}.wikipedia.org/wiki/${whatArticle}`, sumTit];
                    }
                    else { arrArticleSummary = ['', sumHtml, `https://${whatLang}.wikipedia.org/wiki/${whatArticle}`, sumTit]; }

                    createWikiBox(arrArticleSummary, wikiSummData.dir);
                  });
                }
                else{/*No error handling needed here: on network error/offline => no box appears, just the normal link to the Wikipedia article is displayed*/ }
              });
            }
    }
    //#endregion

    //#region create, hide, show preview-box
    function createWikiBox(arrArticleSum,textDirection) {
        let wikiBoxContent = "";
        wikiBoxContent = arrArticleSum[0]; //thumbnail if any

        //summary, if longer than wikiBoxMaxLenght => shorten & add closing tag
        if (arrArticleSum[1].length <= wikiBoxMaxLenght) {
            wikiBoxContent += arrArticleSum[1];            
            if (wikiBoxContent.slice(-1) == ".") {wikiBoxContent = wikiBoxContent.substring(0, wikiBoxContent.length - 1);} //cosmetics, avoid ". ..." at the end, instead show: " ..."
        }
        else{ //summary (HTML) lenght is > wikiBoxMaxLenght => cut it & append the right closing-tag again
            let lastClosingTag = arrArticleSum[1].substr(arrArticleSum[1].lastIndexOf("<"),arrArticleSum[1].length); // </p> (or </ul>, some "disambiguation links")
            lastClosingTag === "</p>" ? 
            wikiBoxContent += arrArticleSum[1].substring(0, wikiBoxMaxLenght-3) : //-3: >could< end in a '</p' (preventively remove 3 chars)          
            wikiBoxContent += arrArticleSum[1].substring(0, wikiBoxMaxLenght-9);  //-9: same but '</li></ul', etc.? (rare, e.g. disambiguation link)
            if (wikiBoxContent.slice(-1) == ".") {wikiBoxContent = wikiBoxContent.substring(0, wikiBoxContent.length - 1);} //cosmetic, avoid ". ..." at the end, show " ..." instead
            wikiBoxContent += "&nbsp;..." + lastClosingTag; // +lastClosingTag: '</li>' is not needed because browsers close <li> automatically (faster) in this case & very rare case
        }
        wikiPreviewBox.innerHTML = wikiBoxContent;        

        //#region footer part
        // if no "(wikipedia.org)" displayed, show arrows (rtl & ltr)
        if (!showWikipediaOrg){ textDirection==="ltr" ? strWikipediaOrg = "<span class='wikiArrow_ltr'>&#x279C;</span></a>" : strWikipediaOrg = "<span class='wikiArrow_rtl'>&#x279C;</span></a>"; }         
        let wikiBoxfooter = "<span class='wikiBoxfooter_" + textDirection + "'><a href='" + arrArticleSum[2] + "' " + openLinkTarget + " rel='noopener'>" + arrArticleSum[3] + strWikipediaOrg + "</span>" +
            "<a href='https://su-pa.net/wikiPrevBox/' target='_blank' rel='noopener' title='Summary box for Wikipedia links - click for info' alt='Summary box for Wikipedia links - click for info'>" +
                "<span class='wikiBoxLogo-w_" + textDirection + "'>W</span></a>";
        wikiBoxfooter = sanitizeApiData(wikiBoxfooter); 
        wikiPreviewBox.insertAdjacentHTML('beforeend', wikiBoxfooter);
        //#endregion

        wikiPreviewBox.getElementsByTagName("P")[0].setAttribute("lang", wikiLang); //set language for hyphens (CSS)
        wikiPreviewBox.getElementsByTagName("P")[0].setAttribute("dir", textDirection);

        showWikiBox();
    }
    function showWikiBox() {
        let wikiPreviewBoxHeight = wikiPreviewBox.getBoundingClientRect().height || 400; //preview-box height
        let wikiTermPosBottom = wikiTermPos.bottom; //distance from the visible "top-edge" (clientY) to the bottom of the wikipedia-link
        let visibleHeight = window.innerHeight;

        if (wikiTermPosBottom < wikiPreviewBoxHeight) { //below <wiki-link>
            wikiPreviewBox.style.top = wikiTermPosBottom + window.scrollY + 'px';
            //avoid disappearing of the preview-box at the bottom edge in cases where the preview-box is higher than the visible space (e.g. portrait mode on mobile)
            if (wikiTermPosBottom + wikiPreviewBoxHeight > visibleHeight) {
                wikiPreviewBox.style.top = window.scrollY + 'px';
            }
        }
        else { //above
            wikiPreviewBox.style.top = wikiTermPos.top + window.scrollY - wikiPreviewBox.getBoundingClientRect().height + 'px';
        }
        wikiPreviewBox.style.opacity = 1;
        wikiPreviewBox.style.visibility = 'visible';
    }
    function hideWikiBox() {
        //avoid flickering, don't fade out-in if mouse leaves the preview-box but covers the <wiki-link>
        if (!wikiTerm.matches(':hover')) {
            wikiPreviewBox.style.opacity = 0;
            wikiPreviewBox.style.visibility = 'hidden';
        }
    }
    //#endregion
//#endregion
})();