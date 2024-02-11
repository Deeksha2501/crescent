var el_up = document.getElementById("hey");
var el_down = document.getElementById("GFG_DOWN");
var el_body = document.getElementById("body");
// el_up.innerHTML = JSON.stringify(GFG_object);

console.log("el_up", el_up);

function gfg_Run() {
  var index = -1;
  var header_image;
//   var header_image_container = document.getElementById(
//     "header_image_container"
//   );
//   var pixels = header_image_container.offsetHeight;
//   scrollImg(pixels);
  setInterval(function () {
    var header_image_container = document.getElementById(
      "header_image_container"
    );
    index = (index + 1) % 3;
    index2 = (index + 1) % 3;

    // header_image = document.getElementById(`header_image_${index}`);  
    // header_image.classList.add("header_transformed_props");

    // console.log(header_image)
    // console.log(header_image.classList);

    // var pixels = header_image_container.offsetHeight;
    // scrollImg(pixels);
    
    // header_image.classList.remove(...header_image.classList);
    // header_image_container.removeChild(header_image);
    // header_image_container.appendChild(header_image);
    
    



    h_img = document.getElementById(`header_image_${index2}`);
    h_img.classList.add("header_transformed_props");
    header_image = document.getElementById(`header_image_${index}`);    
    header_image.classList.remove(...header_image.classList);

    var pixels = header_image_container.offsetHeight;
    header_image_container.removeChild(header_image);


    scrollImg(pixels);
    header_image_container.appendChild(header_image);
    // console.log(h_img.classList);
  }, 3000);
}

// gfg_Run();

function scrollImg(scrollValue) {
  header_image_container.scrollBy({
    top: scrollValue,
    left: 0,
    behavior: "smooth",
  });
}


const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    console.log(entry);
    if(entry.isIntersecting){
      console.log("classes " , entry.target.classList)
      console.log("added class");
      entry.target.classList.add('abc');

    }else {
      console.log("removed class");
      entry.target.classList.remove('abc');}
  })
})

const recobserver = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    console.log(entry);
    if(entry.isIntersecting){
      console.log("classes " , entry.target.classList)
      console.log("added class");
      entry.target.classList.add('appear');

    }else {
      console.log("removed class");
      entry.target.classList.remove('appear');}
  })
})

const frameobserver = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    console.log(entry);
    if(entry.isIntersecting){
      console.log("agigiffyik " , entry.target.classList)
      console.log("added class");
      entry.target.classList.add('appear');

    }else {
      console.log("removed class");
      entry.target.classList.remove('appear');}
  })
})

const catImgAnimationObserver = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    console.log(entry);
    if(entry.isIntersecting){
      console.log("agigiffyik " , entry.target.classList)
      console.log("added class");
      entry.target.classList.add('appear');

    }
    // else {
    //   console.log("removed class");
    //   entry.target.classList.remove('appear');
    // }
  })
})

const e = document.querySelectorAll('.check');
if(e)e.forEach(el =>observer.observe(el));

const elements = document.querySelectorAll('.rectangle-inner');
if(elements)elements.forEach(el =>recobserver.observe(el));

const el = document.querySelectorAll('.frame-hidden');
if(el)el.forEach(e =>frameobserver.observe(e));

const catImgAnimation = document.querySelectorAll('.cat-img-animation');
if(catImgAnimation)catImgAnimation.forEach(e =>catImgAnimationObserver.observe(e));