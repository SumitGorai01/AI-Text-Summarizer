const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");
const copyButton = document.getElementById("copyText");
const downloadButton = document.getElementById("downloadText");
const typedCharCount = document.getElementById("typedCharCount");
const summaryCount = document.getElementById("summaryCount");
const summaryLengthSelect = document.getElementById("summaryLength");
const themeToggle = document.getElementById("themeToggle");

submitButton.disabled = true;

textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);

function verifyTextLength(e) {
  const textarea = e.target;
  if (textarea.value.length > 200 && textarea.value.length < 100000) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

async function submitData() {
  // Add loading state
  submitButton.classList.add("loading");

  const text_to_summarize = textArea.value;
  const choice = summaryLengthSelect.value;

  let params = { max_length: 100, min_length: 40 };
  if (choice === "short") params = { max_length: 60, min_length: 20 };
  if (choice === "detailed") params = { max_length: 200, min_length: 80 };

  try {
    const response = await fetch("/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text_to_summarize, params }),
    });

    const summary = await response.text();
    summarizedTextArea.value = summary;

    // Show word/char count
    summaryCount.textContent = `${summary.split(" ").length} words • ${summary.length} characters`;

    copyButton.style.display = "inline-block";
    downloadButton.style.display = "inline-block";
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Something went wrong. Please try again.", "error");
  } finally {
    // Remove loading state
    submitButton.classList.remove("loading");
  }
}

// Disable button initially
submitButton.disabled = true;

// Count input characters
textArea.addEventListener("input", () => {
  const length = textArea.value.length;
  typedCharCount.textContent = `${length} / 100,000`;
  submitButton.disabled = !(length > 200 && length < 100000);
});

// Handle summarize
submitButton.addEventListener("click", () => {
  submitButton.classList.add("submit-button--loading");

  const text_to_summarize = textArea.value;
  const lengthOption = summaryLengthSelect.value;

  let params;
  if (lengthOption === "short") params = { max_length: 60, min_length: 20 };
  if (lengthOption === "medium") params = { max_length: 100, min_length: 40 };
  if (lengthOption === "detailed") params = { max_length: 150, min_length: 70 };

  fetch("/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text_to_summarize, params }),
  })
    .then((res) => res.text())
    .then((summary) => {
      summarizedTextArea.value = summary.trim();
      summaryCount.textContent = `Summary length: ${summary.split(" ").length} words, ${summary.length} characters`;

      submitButton.classList.remove("submit-button--loading");
      copyButton.style.display = "inline-flex";
      downloadButton.style.display = "inline-flex";
    })
    .catch((err) => {
      console.error(err);
      Swal.fire("Error", "Failed to summarize text.", "error");
      submitButton.classList.remove("submit-button--loading");
    });
});

// Copy to clipboard
copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(summarizedTextArea.value).then(() => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Copied to Clipboard!",
      showConfirmButton: false,
      timer: 1500,
    });
  });
});

// Download as TXT
downloadButton.addEventListener("click", () => {
  const blob = new Blob([summarizedTextArea.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "summary.txt";
  link.click();
});

// Dark mode toggle
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});
