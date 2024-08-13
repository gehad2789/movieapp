let main= document.querySelector("main");
let searchinput=document.querySelector("#searchinput");
let searchbtn=document.querySelector("#searchbtn");
let form =document.querySelector("form");
let scrol=document.querySelector('#scroll');

let apiKey = 'api_key=1cf50e6248dc270629e802686245c2c8';
let baseUrl='https://api.themoviedb.org/3';

//popular movies url[first page]
let apiUrl= baseUrl + '/discover/movie?sort_by=popularity.desc&'+apiKey;

//image url
let imgUrl='https://image.tmdb.org/t/p/w500'; //rest of it to work from response

//search url 
let  searchURL = baseUrl+ '/search/movie?'+apiKey;


//categories 
const categories=[
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

//prev , next page
let page=1;
let nextpage=2;
let prevpage=3;
let lasturl='';
let allpages =100;
let prev=document.getElementById("prev");
let next=document.querySelector("#next");
let current=document.querySelector(".current");








//get movies 

async function getMovies(url){
    lasturl=url;//next prev
    let response=await fetch(url);
    let data=await response.json();
    let finaldata=data.results;
    //next-prev
    if(finaldata.length!=0){
        showMovies(finaldata);//array of movies data only
        page=data.page;
        nextpage=page+1;
        prevpage=page-1;
        allpages=data.total_pages;//api

        current.innerText = page;

        if( page<= 1){
            prev.classList.add('disabled');
            next.classList.remove('disabled')
          }else if(page>= allpages){
            prev.classList.remove('disabled');
            next.classList.add('disabled')
          }else{
            prev.classList.remove('disabled');
            next.classList.remove('disabled')
          }

          //scrool
          scrol.scrollIntoView({behavior : 'smooth'})

        }else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }

        



    }



getMovies(apiUrl);






//show movies in cards
function showMovies(data){
    main.innerHTML='';
    data.forEach(movie=>{
        const {title, poster_path, vote_average, overview, id} = movie;//get it from data obj

        let cardimg=document.createElement("div");
        cardimg.classList.add("result");
        cardimg.innerHTML=`
          <div class="card" style="width: 18rem;">
            <img src="${poster_path? imgUrl+poster_path: "http://via.placeholder.com/1080x1580" }" class="card-img-top" alt="${title}">
             
            <h3 class="card-title">${movie.title}</h3>

            <div class="card-body text-center">
              <h3 class="card-title text-light">${title}</h3>
              <div class="b text-center ">
              <span class="card-text  ${getcolor(vote_average)}">${vote_average}</span> 
              <p class="card-text m_0 overview"> ${overview} <p>
                          <a href="#" class="btn btn-warning mb-5" id='${id}' >KNOW MORE</a>

              </div>


           
    </div>
  </div>
        `

        main.appendChild(cardimg);

        //know more btn
        document.getElementById(id).addEventListener("click",()=>{
            console.log(id);
            openNav(movie);
        })



    })

}


//rate colors[pased into vote-avg span ]
function getcolor(vote){
    if(vote>=8){
        return "green";
    }else if(vote>=5){
        return "orange"
    }else{
        return "red"
    }
}



//search 
form.addEventListener('submit', function(e){
    e.preventDefault();
    let body= document.querySelector("body");
    let searchvalue=searchinput.value;
    if(searchvalue){
        document.querySelector("#demo").innerHTML="";
        getMovies(searchURL+`&query=`+searchvalue);

        console.log(searchvalue)

    

    }else{
        getMovies(apiUrl);
    }
   
  

    
    

})
let categdiv= document.querySelector('#my');


console.log(categdiv);

// filter categories from api [get , set]

let selectedcategory=[];//add link of selected from dd list

function setcateg(){
    categdiv.innerHTML="";
    categories.forEach(category=>{
        let t= document.createElement("li");
        t.classList.add("dropdown-item");

        let a=document.createElement("a");
        a.classList.add("dropdown-item");
        a.href=""

        t.id=category.id;
        t.innerHTML=category.name;
        t.appendChild(a);

        document.querySelector("#my").addEventListener("click",(a)=>{
            a.preventDefault();
            console.log(a.target.id);
            if(selectedcategory.length==0){
                a.preventDefault();

                selectedcategory.push(a.target.id);
            }else{
                if(selectedcategory.includes(a.target.id)){
                    selectedcategory.forEach((id,idx)=>{
                        if(id==a.target.id){
                            selectedcategory.splice(idx,1);

                        }

                    })
                }else{
                    selectedcategory.push(a.target.id);

                    }
                }

                console.log(selectedcategory);
                //The join() method takes all items in an iterable[,] and joins them into one string[return as string before it seperator]
                 //from api website instractions 
                getMovies(apiUrl+"&with_genres="+encodeURI(selectedcategory.join(',')));//search by popalarity
            })
            categdiv.appendChild(t);



        });

       


    }

setcateg();

//last-prev function

next.addEventListener('click',()=>{
    if(allpages>=nextpage){
        pagecall(nextpage); //put url of next as aparameter when click

        }
    });


    prev.addEventListener('click',()=>{
        if(prevpage>0){
            pagecall(prevpage); //put url of next as aparameter when click
    
            }

    })

    /*to next or rrev page*/
 function pagecall(page){
    let urlSplit = lasturl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
      let url = lasturl + '&page='+page
      getMovies(url);
    }else{
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length -1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] +'?'+ b
        getMovies(url);
      }
 
 }



  /* Open nav full screen  when someone clicks on the span element */

  let overlaycontent=document.querySelector('#overlay-content');
function openNav(movie) {
    //open video
    let id=movie.id;
    fetch(baseUrl+"/movie/"+id +"/videos?"+apiKey).then(res=>res.json())
    .then(VideoData =>{
        console.log(VideoData);
        if(VideoData){
            document.getElementById("myNav").style.width = "100%";
            if(VideoData.results.length>0){
                var videosarray=[];
                var dots = [];

                VideoData.results.forEach(video=>{
                    let {name, key, site} = video
                    if(site=="YouTube"){
                        videosarray.push(`
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}"
                             class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            
                                    `)

                    }

                 
                })
             
                overlaycontent.innerHTML=videosarray.join('');//first call frame
                slides=0;//intially first vid
                showvideos();//func to add show class for target video

            }else{
                overlaycontent.innerHTML=`<h2 style="color:red;"> no content founded <h2>`;

            }

        }
    })
    document.getElementById("myNav").style.width = "100%";
  }
  
  /* Close when someone clicks on the "x" symbol inside the overlay */
  function closeNav() {
    //video close
    document.getElementById("myNav").style.width = "0%";
  }
  
  let targetvideo=document.querySelectorAll(".embed");//group of vids 
  console.log(targetvideo);

let allvideos=0;

  /** */
  let slides=0;
  function showvideos(){
    let targetvideo=document.querySelectorAll(".embed");//group of vids 
    allvideos=targetvideo.length;
    targetvideo.forEach((vid, idx)=>{//idx= id of targrt vid
        if(slides==idx){
            vid.classList.add("show");
            vid.classList.remove("hide");


        }else{
            vid.classList.remove("show");
            vid.classList.add("hide");

        }

    })

  }


  /****swipe videos */
let arrowleft=document.querySelector("#arrowleft");
let arrowright=document.querySelector("#arrowright");
arrowleft.addEventListener('click', ()=>{
    if(slides>0){//first vid
        slides--;
    }else{
        slides= allvideos-1;
    }
    showvideos()
})

arrowright.addEventListener('click', ()=>{
    if(slides<allvideos-1){// swipe until last video
        slides++;
    }else{
        slides= 0; //last 
    }
    showvideos()
})



