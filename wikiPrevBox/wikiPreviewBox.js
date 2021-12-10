 /*!
 * WIKIPEDIA PREVIEW BOXES
 * su-pa.net (c) version 12/10/2021, 1.0.0, nick, MIT-License
 * https://su-pa.net/wikiPrevBox/ :: project page
 */
//#region wikipedia preview boxes
"use strict"; //without, safariPhone cooks scrambled let-focuses
{//simple(st) "let namespace" => use let or const inside this brakets    
    
    //path to the CSS file
    document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', '<link rel="stylesheet" type="text/css" href="/wikiPrevBox/wikiPreviewBox.min.css">');
    //document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend','<link rel="stylesheet" type="text/css" href="https://su-pa.net/wikiPrevBox/wikiPreviewBox.min.css">');
    
    //#region previewbox
    //add an empty wiki-preview-box container, everything happens inside here 
    document.body.insertAdjacentHTML('afterbegin', '<article id="wikiPreviewBox" class="wikiPreviewBox"></article>');

    let showNoImages = false;
    let wikiBoxWidth = 300; //default preview box width
    let textDirection = document.dir || ""; //website text direction if set (<html ... dir="rtl">)    

    //optional custom settings affecting all preview boxes
    //how to use: <script data-wikipreview="noimages,width=250" src="... ></script>    
    if (typeof (document.currentScript.dataset.wikipreview) != "undefined") {
        // show image in the preview boxes (if there is one); set in <script data-wikipreview="noimages" src="... ></script>
        showNoImages = document.currentScript.dataset.wikipreview.includes("noimages") ? true : false;        
        // custom width for the preview boxes, standard width=300, min=200, max=400 
        wikiBoxWidth = Math.min(Math.max(parseInt(document.currentScript.dataset.wikipreview.replace(/\D/g,'') || 300),200),400);         
    }

    let wikiBoxMaxLenght = 280; //maxnumof chars in the preview box (includes some HTML tags (~15 chars ... <p><b>... // on disambiguation terms additional <ul><li>...</li>...</ul>)
    let whatArticle = ""; //term to show (last part of the url to a wikipedia article)
    let wikiArticleUrl = "", wikiLang = "", wikiTermPos, wikiTerm;

    let wikiPreviewBox = document.getElementById("wikiPreviewBox");
    wikiPreviewBox.style.width = wikiBoxWidth + "px";
    
    //add preview box events
    wikiPreviewBox.addEventListener("click", hideWikiBox);
    wikiPreviewBox.addEventListener("mouseover", showWikiBox);
    wikiPreviewBox.addEventListener("mouseout", hideWikiBox);
    //#endregion

    //#region Wikipedia links
    
    //get all wikipedia links exept the once that have a "#nopreview" at the end
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

    //#region get data from wikipedia
    function getWikiPreviewData(whatArticle, whatLang = 'en') {
        whatArticle = (whatArticle.charAt(0).toUpperCase() + whatArticle.slice(1)).replace(/ /g, '_'); //be nice to wikipedia => make/ensure 1st letter is uppercase & transform blanks to underscores
        
        let showThisImgAnyway = whatArticle.includes('#showimage');
        if (showThisImgAnyway) { whatArticle = whatArticle.replace('#showimage','')}

        let arrArticleSummary = [];
        //fetch/get data for the preview box
        if (navigator.onLine) { //android webview could(?) show online despite of offline, 11/2021 (bug) 
            fetch('https://' + whatLang + '.m.wikipedia.org/api/rest_v1/page/summary/' + whatArticle)
                .then(response => {                    
                    if (response.status >= 200 && response.status <= 299) { //ok, no network error (but neverthless could be a 404 error)
                        response.json().then(wikiSummData => {
                            //console.log(wikiSummData); //all available summary data
                            //show image => wiki has an image && (showNoImages is not true || showNoImages is true but #showimage is set) ("#showimage" at the end of the link to the wiki article)
                            if ((wikiSummData.hasOwnProperty('thumbnail') && !showNoImages) || showThisImgAnyway) { 
                                arrArticleSummary = ["<img height='" + wikiSummData.thumbnail.height + "' src='" + wikiSummData.thumbnail.source + "'/>", wikiSummData.extract_html, 'https://' + whatLang + '.wikipedia.org/wiki/' + whatArticle, wikiSummData.title];
                            }
                            //show no image => there is no image on wiki or no image should be shown
                            else { arrArticleSummary = ["", wikiSummData.extract_html, 'https://' + whatLang + '.wikipedia.org/wiki/' + whatArticle, wikiSummData.title]; } //no image
                            
                            createWikiBox(arrArticleSummary,wikiSummData.dir);
                        })
                    }
                    else {/*network error/404, term not found (but there is still a(n "error") message: "GET https...wiki... 404" )*/ }
                }
                )
        }
        else { /* is not online, maybe use ononline */ }
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
        else{ //summery (HTML) lenght is > wikiBoxMaxLenght => cut it & append the right closing-tag again
            let lastClosingTag = arrArticleSum[1].substr(arrArticleSum[1].lastIndexOf("<"),arrArticleSum[1].length); // </p> (or </ul>, some "disambiguation links")
            lastClosingTag === "</p>" ? 
            wikiBoxContent += arrArticleSum[1].substring(0, wikiBoxMaxLenght-3) : //-3: >could< end in a '</p' (preventively remove 3 chars)          
            wikiBoxContent += arrArticleSum[1].substring(0, wikiBoxMaxLenght-9);  //-9: same but '</li></ul', etc.? (rare, e.g. disambiguation link)
            if (wikiBoxContent.slice(-1) == ".") {wikiBoxContent = wikiBoxContent.substring(0, wikiBoxContent.length - 1);} //cosmetically, avoid ". ..." at the end, showing " ..." instead
            wikiBoxContent += "&nbsp;..." + lastClosingTag; // +lastClosingTag: '</li>' is not needed because browsers close <li> automatically (faster) in this case & very rare case
        }
        wikiPreviewBox.innerHTML = wikiBoxContent;

        let wikiBoxfooter = "<span class='wikiBoxfooter_" + textDirection + "'><a href='" + arrArticleSum[2] + "' target='_blank' rel='noopener'>" + arrArticleSum[3] + "</a> (wikipedia.org)</span>" +
            "<a href='https://su-pa.net/wikiPrevBox/' target='_blank' rel='noopener' title='about Wikipedia preview box - click for info' alt='about Wikipedia preview box - click for info'>" +
                "<span class='wikiBoxLogo-w_" + textDirection + "'>W</span></a>";
        
        wikiPreviewBox.insertAdjacentHTML('beforeend', wikiBoxfooter);     
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
}
//#endregion