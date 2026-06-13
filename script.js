// Get Dom...
const sourceLang = document.getElementById("source-lang")
const inputText = document.getElementById("input-text")
const clearBtn = document.getElementById("clear-input")
const swapBtn = document.getElementById("swap-btn")
const targetLang = document.getElementById("target-lang")
const showOutput = document.getElementById("output-text")
const translateBtn = document.getElementById("translate-btn")
const charCount = document.querySelector(".char-count")


// Functionality Start...
translateBtn.addEventListener("click", async () => {

    if (!inputText.value.trim()) {
        alert("Please enter text")
        return
    }

    const text = inputText.value
    const source = sourceLang.value
    const target = targetLang.value

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${text}&langpair=${source}|${target}`
        )

        const data = await response.json()
        showOutput.value = data.responseData.translatedText
    } catch (error) {
        console.error("Translation error:", error)
        alert("Translation failed. Please try again.")
    }

})

// clear button 
clearBtn.addEventListener("click", () => {
    inputText.value = ""
    if (charCount) {
        charCount.textContent = "0 / 5000"
    }
})

// Character count
if (inputText && charCount) {
    
    inputText.addEventListener("input", () => {
        charCount.textContent = `${inputText.value.length} / 5000`
    })
}

// SWAP Logic - Simple & Clean
swapBtn.addEventListener("click", () => {

    // Swap languages
    const tempLang = sourceLang.value
    sourceLang.value = targetLang.value
    targetLang.value = tempLang

    //  Swap text
    const tempText = inputText.value
    inputText.value = showOutput.value
    showOutput.value = tempText

    //  Update char count
    if (charCount) {
        charCount.textContent = `${inputText.value.length} / 5000`
    }
})