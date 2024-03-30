var apikey ="qAmKF2kQVTDCrs8w4kh4riUym8OBbMqqB66jz9FMYNIRGXxExScSxGGO";
var perpage=15;
var currentpage=1;

var allimages=document.querySelector(".images");
var loadmore=document.querySelector(".load");
var input=document.getElementById("input");
let searchterm=null;

var box=document.querySelector(".light-box");
var close=document.getElementById("close");

// download image
var downloadimage = (imageurl)=>
{
    fetch(imageurl).then(res=>res.blob()).then(file=>{
        var a=document.createElement('a');
        a.href=URL.createObjectURL(file);
        a.download=new Date().getTime();
        a.click();
    }).catch(()=>alert("failed to download image"));     
}
// lightbox section
var lightbox = (img,name)=>
{
    box.classList.add("show");
    box.querySelector("p").innerText=name;
    box.querySelector("img").src=img;
    document.body.style.overflow="hidden";
    // set the data-img to image src
    download.setAttribute("data-img",img); 
}
// hide lightbox
var hide=()=>
{
    box.classList.remove("show");
    document.body.style.overflow="auto";
}
// create new every array element using map
var gethtml= (images)=>
{
    allimages.innerHTML += images.map(img=>
        `<li class="card" onclick="lightbox('${img.src.large2x}','${img.photographer}')">
        <img src="${img.src.large2x}" alt="">
        <div class="details">
            <div class="photographer">
                <i class="fa-solid fa-camera"></i>
                <p>${img.photographer}</p>
            </div>
            <button onclick="downloadimage('${img.src.large2x}');event.stopPropagation()">
                     <i class="fa-solid fa-download"></i>
            </button>
        </div>
    </li>`
    ).join("");
}
// api fetch
var getimages = (apiurl)=>{

    loadmore.innerText="Loading..."
    loadmore.classList.add("hide")
    // api call with authorization
    fetch(apiurl,{
        headers:{ Authorization: apikey }
    }).then(response=> response.json())
      .then(data=>{
        gethtml(data.photos)

        loadmore.innerText="Load More"
        loadmore.classList.remove("hide")
    })
         
    
}

// load more section
loadmore.addEventListener("click",()=>{
    currentpage++
    var apiurl = getimages(`https://api.pexels.com/v1/curated?page=${currentpage}&per_page=${perpage}`)
    apiurl = searchterm ?`https://api.pexels.com/v1/search?query=${searchterm}&page=${currentpage}&per_page=${perpage}` : apiurl
    getimages(apiurl)
})

// search images section
var searchimage=(e)=>{
    if(e.target.value === '')
    {
        return searchterm=null;
    }
    // current page update,allimages empty,get searchterm value put it api
    if(e.key === "Enter")
    {
        currentpage=1;
        searchterm=e.target.value;
        allimages.innerHTML="";
        getimages(`https://api.pexels.com/v1/search?query=${searchterm}&page=${currentpage}&per_page=${perpage}`);
    }
}

getimages(`https://api.pexels.com/v1/curated?page=${currentpage}&per_page=${perpage}`);

input.addEventListener("keyup",searchimage);
close.addEventListener("click",hide);

// lightbox download
var download=document.getElementById("download");
download.addEventListener("click",(e)=>{
    downloadimage(e.target.dataset.img)
})