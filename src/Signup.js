const createPw = document.querySelector("#create_pw"),
confirmPw = document.querySelector("#confirm_pw"),
pwShow = document.querySelector(".show"),
alertIcon = document.querySelector(".error"),
alertText= document.querySelector(".text"),
submitBtn = document.querySelector("#button");
pwShow.addEventListener("click", ()=>{
  if((createPw.type === "password") && (confirmPw.type === "password")){
    createPw.type = "text";
    confirmPw.type = "text";
    pwShow.classList.replace("fa-eye-slash","fa-eye");
  }else {
    createPw.type = "password";
    confirmPw.type = "password";
    pwShow.classList.replace("fa-eye","fa-eye-slash");
  }
});
createPw.addEventListener("input", ()=>{
  let val = createPw.value.trim()
  if(val.length >= 8){
    confirmPw.removeAttribute("disabled");
    submitBtn.removeAttribute("disabled");
    submitBtn.classList.add("active");
  }else {
    confirmPw.setAttribute("disabled", true);
    submitBtn.setAttribute("disabled", true);
    submitBtn.classList.remove("active");
    confirmPw.value = "";
    alertText.style.color = "#a6a6a6";
    alertText.innerText = "Enter at least 8 characters";
    alertIcon.style.display = "none";
  }
});
submitBtn.addEventListener("click", ()=>{
if(createPw.value === confirmPw.value){
    console.log(createPw.value)
    downloadFile('http://localhost:3000/generate-keys/json', 'keyPair.json', {password: createPw.value});
}else {
  alertText.innerText = "Password didn't matched";
  alertIcon.style.display = "block";
  alertText.style.color = "#D93025";
}
});

function downloadFile(url, name, password) {
    console.log('Download')
    // Send GET request to server
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(password)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.blob();
        })
        .then(blob => {
            // Create a link element to trigger the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            console.log(url.endsWith('/json'))
            a.download = name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            setTimeout(function() {
                window.location.href = "index.html";
            }, 1000);
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });
}