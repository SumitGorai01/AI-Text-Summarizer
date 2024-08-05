const textArea = document.getElementById("text_to_summarize");

const submitButton = document.getElementById("submit-button");

const summarizedTextArea = document.getElementById("summary");

const copyButton = document.getElementById("copyText");

const typedCharCount = document.getElementById("typedCharCount");

submitButton.disabled = true;


textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);

function verifyTextLength(e) {
 // The e.target property gives us the HTML element that triggered the event, which in this case is the textarea. We save this to a variable called 'textarea'
  const textarea = e.target;

  // Verify the TextArea value.
  if (textarea.value.length > 200 && textarea.value.length < 100000) {
    // Enable the button when text area has value.
    submitButton.disabled = false;
  } else {
    // Disable the button when text area is empty.
    submitButton.disabled = true;
  }
}

function submitData(e) {

 // This is used to add animation to the submit button
  submitButton.classList.add("submit-button--loading");

  const text_to_summarize = textArea.value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "text_to_summarize": text_to_summarize
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // Send the text to the server using fetch API

 // Note - here we can omit the “baseUrl” we needed in Postman and just use a relative path to “/summarize” because we will be calling the API from our Replit!  
  fetch('/summarize', requestOptions)
    .then(response => response.text()) // Response will be summarized text
    .then(summary => {
      // Do something with the summary response from the back end API!

      // Update the output text area with new summary
      summarizedTextArea.value = summary;

      // Stop the spinning loading animation
      submitButton.classList.remove("submit-button--loading");
      copyButton.style.display = "inline-block"
    })
    .catch(error => {
      console.log(error.message);
    });
}


copyButton.addEventListener("click",function(){
  copyToClipBoard(summarizedTextArea.value);
  console.log(`Text : ${summarizedTextArea.value}`)
});
function copyToClipBoard(text){
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  // alert("Copied to Clipboard Successfully !")
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Text Copied to Clipboard Successfully ",
    showConfirmButton: false,
    timer: 2000
  });
}
textArea.addEventListener('input',function(){
  typedCharCount.textContent = `${textArea.value.length}/100,000 characters`
});
